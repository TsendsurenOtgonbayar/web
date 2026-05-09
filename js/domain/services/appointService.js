const SERVICES = [
	{ id: 1, name: "Ерөнхий үзлэг", price: 30000, doctors: ["Д.Бат", "Д.Сараа"] },
	{ id: 2, name: "Вакцин", price: 20000, doctors: ["Д.Тэмүүжин", "Д.Номин"] },
	{ id: 3, name: "Мэс засал", price: 150000, doctors: ["Д.Болд", "Д.Ганаа"] },
	{ id: 4, name: "Лабораторийн шинжилгээ", price: 20000, doctors: ["Д.Болд", "Д.Ганаа"] },
	{ id: 5, name: "Шүдний эмчилгээ", price: 100000, doctors: ["Д.Номин", "Д.Бат"] },
	{ id: 6, name: "Арьс үсний арчилгаа", price: 100000, doctors: ["Д.Сараа", "Д.Бат"] }
];

const TIME_SLOTS = ["09:00", "11:00", "14:00", "17:00", "19:00"];

export function listServices() {
	return SERVICES.map((service) => ({ ...service }));
}

export function listTimeSlots() {
	return [...TIME_SLOTS];
}

export function findServiceById(id) {
	return SERVICES.find((service) => service.id === id) || null;
}

export function findServiceByName(name) {
	if (!name) return null;
	return SERVICES.find((service) => service.name === name) || null;
}
