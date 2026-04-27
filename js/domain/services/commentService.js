const COMMENTS_KEY = "petcare_comments";
const MAX_COMMENTS = 10;

import  Comment  from "../entity/comment.js";

function parseComments(rawComments) {
	if (!rawComments) {
		return [];
	}

	try {
		const parsed = JSON.parse(rawComments);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		console.error("Сэтгэгдэл parse хийхэд алдаа гарлаа:", error);
		return [];
	}
}

export function loadComments() {
	return parseComments(localStorage.getItem(COMMENTS_KEY));
}

export function saveComments(comments) {
	localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function getRecentComments(limit = MAX_COMMENTS) {
	const comments = loadComments();
	return comments.slice(-limit);
}

export function validateCommentInput(text, rating) {
	if ((text || "").trim().length < 5) {
		return {
			valid: false,
			message: "Сэтгэгдэл хамгийн багадаа 5 тэмдэгт байх ёстой.",
		};
	}

	if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		return {
			valid: false,
			message: "Та одоор үнэлгээ өгнө үү.",
		};
	}

	return { valid: true, message: "ok" };
}

export function addComment({ text, rating, userId = null, authorName = "Тодорхойгүй" }) {
	const comments = loadComments();
	const comment = new Comment({
		rating,
		text: text.trim(),
		userId,
		authorName,
	});
	comments.push(comment.getInfo());

	while (comments.length > MAX_COMMENTS) {
		comments.shift();
	}

	saveComments(comments);
	return comments;
}
