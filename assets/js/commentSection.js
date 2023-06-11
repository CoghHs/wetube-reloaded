/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/commentSection.js":
/*!*****************************************!*\
  !*** ./src/client/js/commentSection.js ***!
  \*****************************************/
/***/ (() => {

eval("const videoContainer = document.getElementById(\"videoContainer\");\nconst form = document.getElementById(\"commentForm\");\nconst videoComment = document.querySelector(\".video__comment\");\nconst span2 = document.querySelector(\".video__delete\");\nconst addComment = (text, id) => {\n  const videoComments = document.querySelector(\".video__comments ul\");\n  const newComment = document.createElement(\"li\");\n  newComment.dataset.id = id;\n  newComment.className = \"video__comment\";\n  const icon = document.createElement(\"i\");\n  icon.classList = \"fas fa-comment\";\n  const span = document.createElement(\"span\");\n  span.innerText = ` ${text}`;\n  const span2 = document.createElement(\"span\");\n  span2.innerText = \"  ❌\";\n  span2.className = \"video__delete\";\n  newComment.appendChild(icon);\n  newComment.appendChild(span);\n  newComment.appendChild(span2);\n  videoComments.prepend(newComment);\n};\nconst handleSubmit = async event => {\n  event.preventDefault();\n  const textarea = form.querySelector(\".textarea\");\n  const text = textarea.value;\n  const videoId = videoContainer.dataset.id;\n  if (text === \"\") {\n    return;\n  }\n  const response = await fetch(`/api/videos/${videoId}/comment`, {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n    body: JSON.stringify({\n      text\n    })\n  });\n  if (response.status === 201) {\n    textarea.value = \"\";\n    const {\n      newCommentId\n    } = await response.json();\n    addComment(text, newCommentId);\n  }\n};\nconst handleDelete = async e => {\n  const commentId = videoComment.dataset.id;\n  const response = await fetch(`/api/comments/${commentId}/delete`, {\n    method: \"DELETE\"\n  });\n  if (response.status === 201) {\n    const comment = e.target.parentElement;\n    comment.remove();\n  }\n};\nif (form) {\n  form.addEventListener(\"submit\", handleSubmit);\n  span2.addEventListener(\"click\", handleDelete);\n}\n\n//# sourceURL=webpack://wetube/./src/client/js/commentSection.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/commentSection.js"]();
/******/ 	
/******/ })()
;