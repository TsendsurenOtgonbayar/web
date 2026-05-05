/**
 * Shared Contract: Service Offering DTO
 * Service/treatment information owned by Appointment Service
 * Shared with other services via DTO
 */

export class ServiceOfferingDTO {
  constructor(data = {}) {
    this.serviceId = data.serviceId;
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.estimatedDuration = data.estimatedDuration || 30; // minutes
    this.category = data.category; // general_checkup, vaccination, surgery, dental, grooming, lab_work
    this.createdAt = data.createdAt;
  }

  toJSON() {
    return {
      serviceId: this.serviceId,
      name: this.name,
      description: this.description,
      price: this.price,
      estimatedDuration: this.estimatedDuration,
      category: this.category,
      createdAt: this.createdAt
    };
  }
}

export default ServiceOfferingDTO;
