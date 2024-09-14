const taskIdDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskMealDOM = document.querySelector(".task-edit-meal");
const taskCommentDOM = document.querySelector(".task-edit-comment");
const taskSugarDOM = document.querySelector(".task-edit-sugar");
const taskInsulinDOM = document.querySelector(".task-edit-insulin");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempDesc;

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/tasks/${id}`);
    const {
      _id: taskID,
      completed,
      name,
      meal,
      comment,
      sugar,
      insulin,
    } = task;

    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskMealDOM.value = meal;
    taskCommentDOM.value = comment;
    taskSugarDOM.value = sugar;
    taskInsulinDOM.value = insulin;
    // taskDateDOM.valueAsDate = new Date(tdate);
    if (completed) {
      taskCompletedDOM.checked = true;
    }
  } catch (error) {
    console.log(error);
  }
};

showTask();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();
  try {
    const taskName = taskNameDOM.value;
    const taskMeal = taskMealDOM.value;
    const taskComment = taskCommentDOM.value;
    const taskSugar = taskSugarDOM.value;
    const taskInsulin = taskInsulinDOM.value;
    const taskCompleted = taskCompletedDOM.checked;
    // const taskDate = taskDateDOM.value;
    // const date_string =
    //   taskDate.substring(8, 10) +
    //   "_" +
    //   taskDate.substring(5, 7) +
    //   "_" +
    //   taskDate.substring(0, 4);
    const {
      data: { task },
    } = await axios.patch(`/api/tasks/${id}`, {
      name: taskName,
      meal: taskMeal,
      comment: taskComment,
      sugar: taskSugar,
      insulin: taskInsulin,
      completed: taskCompleted,
    });

    const { _id: taskID, name, meal, sugar, insulin, completed } = task;

    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskMealDOM.value = meal;
    taskCommentDOM.value = comment;
    taskSugarDOM.value = sugar;
    taskInsulinDOM.value = insulin;
    tempDesc = desc;
    if (completed) {
      taskCompletedDOM.checked = true;
    }
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error(error);
    taskNameDOM.value = tempDesc;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
