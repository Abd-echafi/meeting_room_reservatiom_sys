const { Op } = require('sequelize');
const Room = require('../models/roomModel');
const Image = require('../models/imageModel');
class APIFeatures {
  constructor(model, queryfile) {
    this.model = model;
    this.queryfile = queryfile;
    this.options = {
      where: {}
    };
  }

  filter = () => {
    const { minPrice, maxPrice, status, search, capacity } = this.queryfile;
    if (search) this.options.where.name = { [Op.like]: `%${search}%` };
    if (capacity) this.options.where.capacity = { [Op.gte]: capacity };
    if (status) {
      if (status === 'other') {
        this.options.where.status = {
          [Op.in]: ['Confirmed', 'Canceled']
        };
      }
      else {
        this.options.where.status = status;
      }
    }
    if (minPrice || maxPrice) {
      this.options.where.price = {};
      if (minPrice) this.options.where.price[Op.gte] = Number(minPrice);
      if (maxPrice) this.options.where.price[Op.lte] = Number(maxPrice);
    }

    return this;
  }

  sort = () => {
    if (this.queryfile.sort) {
      const sortFields = this.queryfile.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        } else {
          return [field, 'ASC'];
        }
      });
      this.options.order = sortFields;
    }
    return this;
  }

  paginate = () => {
    const page = parseInt(this.queryfile.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    this.options.limit = limit;
    this.options.offset = offset;

    return this;
  }

  exec = () => {
    if (this.model === 'Booking') {
      console.log('okk');
      this.options.include = [{ model: Room, as: 'room', attributes: ['pricing'], }]
    }
    return this.model.findAll(this.options);
  }
}

module.exports = APIFeatures;
