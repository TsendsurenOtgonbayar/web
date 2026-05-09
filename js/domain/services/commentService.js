import { getComments, setComments } from "./storageService.js";

export function listComments(limit = 10) {
	const comments = getComments();
	if (limit <= 0) return comments;
	return comments.slice(-limit);
}

export function addComment({ text, rating }) {
	const comments = getComments();
	const comment = {
		text,
		rating,
		createdAt: new Date().toLocaleString()
	};

	comments.push(comment);
	setComments(comments);
	return comment;
}
