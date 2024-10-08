const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

// const getAlldynamicIn = async (req, res) => {
//   const tasks = await Task.find({});
//   return res.status(200).json({ tasks });
// };

const getAlldynamicIn = async (req, res) => {
  console.log(req.query);

  const {
    completed,
    name,
    meal,
    comment,
    createdAt,
    sugar,
    insulin,
    sort,
    fields,
    numericFilters,
    transtype,
  } = req.query;
  const queryObject = {};

  if (completed) {
    queryObject.completed = completed === "true" ? true : false;
  }

  // if (name) {
  //   queryObject.name = name;
  // }

  if (name) {
    queryObject.year_month = { $regex: name, $options: "i" };
  }

  if (meal) {
    queryObject.comment = { $regex: meal, $options: "i" };
  }

  if (comment) {
    queryObject.comment = { $regex: comment, $options: "i" };
  }

  if (numericFilters) {
    const opeartorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$e",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${opeartorMap[match]}-`
    );
    console.log(filters);

    const options = ["sugar"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(numericFilters);
  }

  console.log(queryObject);

  let result = Task.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10000;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  console.log(page);
  console.log(limit);
  const tasks = await result;
  res.status(200).json({ tasks });
};

const getAlldynamic = asyncWrapper(getAlldynamicIn);

module.exports = {
  getAlldynamic,
};
