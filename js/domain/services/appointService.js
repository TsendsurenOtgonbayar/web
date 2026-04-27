const SERVICE_OPTIONS = [
	{ id: 1, name: "Ерөнхий үзлэг", price: 30000, doctors: ["Д.Бат", "Д.Сараа"] },
	{ id: 2, name: "Вакцин", price: 20000, doctors: ["Д.Тэмүүжин", "Д.Номин"] },
	{ id: 3, name: "Мэс засал", price: 150000, doctors: ["Д.Болд", "Д.Ганаа"] },
	{ id: 4, name: "Лабораторийн шинжилгээ", price: 20000, doctors: ["Д.Болд", "Д.Ганаа"] },
	{ id: 5, name: "Шүдний эмчилгээ", price: 100000, doctors: ["Д.Номин", "Д.Бат"] },
	{ id: 6, name: "Арьс үсний арчилгаа", price: 100000, doctors: ["Д.Сараа", "Д.Бат"] },
];

const DOCTOR_SCHEDULES = {
	"Д.Бат": { workingDays: "Даваа, Лхагва, Баасан", workingHours: "09:00-13:00" },
	"Д.Сараа": { workingDays: "Мягмар, Пүрэв, Бямба", workingHours: "10:00-16:00" },
	"Д.Тэмүүжин": { workingDays: "Даваа, Мягмар, Баасан", workingHours: "11:00-17:00" },
	"Д.Номин": { workingDays: "Лхагва, Пүрэв, Бямба", workingHours: "09:30-15:30" },
	"Д.Болд": { workingDays: "Даваа-Баасан", workingHours: "08:30-14:30" },
	"Д.Ганаа": { workingDays: "Даваа, Лхагва, Баасан", workingHours: "12:00-18:00" },
};

const APPOINTMENT_TIMES = ["09:00", "11:00", "14:00", "17:00", "19:00"];

class AppointmentService {
	static getServiceOptions() {
		return [...SERVICE_OPTIONS];
	}

	static getServiceById(serviceId) {
		return SERVICE_OPTIONS.find((service) => service.id === serviceId) || null;
	}

	static getServiceByName(serviceName) {
		return SERVICE_OPTIONS.find((service) => service.name === serviceName) || null;
	}

	static getTimes() {
		return [...APPOINTMENT_TIMES];
	}

	static getDoctorSchedule(doctorName) {
		return DOCTOR_SCHEDULES[doctorName] || null;
	}
}

export default AppointmentService;
