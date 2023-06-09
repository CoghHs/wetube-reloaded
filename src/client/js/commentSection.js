const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComment = document.querySelector(".video__comment");
const span2List = document.querySelectorAll(".video__delete");

const addComment = (text, id) => {
	const videoComments = document.querySelector(".video__comments ul");
	const newComment = document.createElement("li");
	newComment.dataset.id = id;
	newComment.className = "video__comment";
	const icon = document.createElement("i");
	icon.classList = "fas fa-comment";
	const span = document.createElement("span");
	span.innerText = ` ${text}`;
	const span2 = document.createElement("span");
	span2.innerText = "  ❌";
	span2.className = "video__delete";
	newComment.appendChild(icon);
	newComment.appendChild(span);
	newComment.appendChild(span2);
	videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
	event.preventDefault();
	const textarea = form.querySelector(".textarea");
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	if (text === "") {
		return;
	}
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});
	if (response.status === 201) {
		textarea.value = "";
		const { newCommentId } = await response.json();
		location.reload();
	}
};

const handleDelete = async (e) => {
	const commentId = e.target.parentElement.dataset.id;
	console.log(commentId);
	const response = await fetch(`/api/comments/${commentId}/delete`, {
		method: "POST",
	});
	if (response.status === 201) {
		const comment = e.target.parentElement;
		comment.remove();
	}
};

if (form) {
	form.addEventListener("submit", handleSubmit);
	for (let i = 0; i < span2List.length; i++) {
		const span2 = span2List[i];
		span2.addEventListener("click", handleDelete);
	}
}
