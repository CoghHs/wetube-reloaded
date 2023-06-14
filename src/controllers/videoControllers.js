import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
	const videos = await Video.find({})
		.sort({ createdAt: "desc" })
		.populate("owner");
	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	console.log(videos);
	return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id).populate("owner").populate("comments");
	console.log(video);
	if (!video) {
		return res.render("404", { pageTitle: "Video not found." });
	}
	return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found." });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "Not authorized");
		return res.status(403).redirect("/");
	}
	return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { id } = req.params;
	const { title, description, hashtags } = req.body;

	try {
		const video = await Video.findById(id);

		if (!video) {
			return res.status(404).render("404", { pageTitle: "Video not found." });
		}

		if (String(video.owner) !== String(_id)) {
			req.flash("error", "You are not the owner of the video.");
			return res.status(403).redirect("/");
		}

		video.title = title;
		video.description = description;
		video.hashtags = Video.formatHashtags(hashtags);
		await video.save();

		req.flash("success", "Changes saved.");
		return res.redirect(`/videos/${id}`);
	} catch (error) {
		console.log(error);
		return res.status(500).render("500", { pageTitle: "Server Error" });
	}
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { video, thumb } = req.files;
	const { title, description, hashtags } = req.body;
	try {
		const newVideo = await Video.create({
			title,
			description,
			fileUrl: video[0].path,
			thumbUrl: thumb[0].path,
			owner: _id,
			hashtags: Video.formatHashtags(hashtags),
		});
		const user = await User.findById(_id);
		user.videos.push(newVideo._id);
		user.save();
		return res.redirect("/");
	} catch (error) {
		return res.statud(400).render("upload", {
			pageTitle: "Upload Video",
			errorMessage: error.message,
		});
	}
};

export const deleteVideo = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	const user = await User.findById(_id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found." });
	}
	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}

	await Video.findByIdAndDelete(id);
	user.videos.splice(user.videos.indexOf(id), 1);
	user.save();
	return res.redirect("/");
};

export const search = async (req, res) => {
	const { keyword } = req.query;
	let videos = [];
	if (keyword) {
		videos = await Video.find({
			title: {
				$regex: new RegExp(`${keyword}`, "i"),
			},
		}).populate("owner");
	}
	return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}
	video.meta.views = video.meta.views + 1;
	await video.save();
	return res.sendStatus(200);
};

export const createComment = async (req, res) => {
	const {
		session: { user },
		body: { text },
		params: { id },
	} = req;

	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}
	const comment = await Comment.create({
		text,
		owner: user._id,
		video: id,
	});
	video.comments.push(comment._id);
	user.comments.push(comment._id);
	video.save();
	console.log(user._id);
	return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
	if (req.session.user === undefined) {
		req.flash("error", "Login first");
		return res.status(401).redirect("/");
	}
	const {
		session: {
			user: { _id },
		},
		params: { id },
	} = req;
	const comment = await Comment.findById(id);
	console.log("deleteComment");
	if (!comment) {
		return res.status(404).render("404", { pageTitle: "Video not found." });
	}
	if (String(comment.owner._id) !== String(_id)) {
		req.flash("error", "You are not the owner of video");
		return res.status(403).redirect("/");
	}
	await Comment.findByIdAndDelete(id);
	const commentsOwner = await User.findById(_id);
	req.session.user = commentsOwner;
	return res.sendStatus(201);
};
