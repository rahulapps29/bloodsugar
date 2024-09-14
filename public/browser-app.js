const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputName = document.querySelector(".task-name");
const taskInputMeal = document.querySelector(".task-meal");
const taskInputSugar = document.querySelector(".task-sugar");
const taskInputInsulin = document.querySelector(".task-insulin");
const taskInputComment = document.querySelector(".task-comment");

const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/tasks/d");
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const {
          completed,
          _id: taskID,
          name,
          meal,
          comment,
          sugar,
          insulin,
          createdAt,
        } = task;
        return `<div class="single-task ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>
     ${createdAt.substring(0, 10)}  ${new Date(createdAt).toLocaleString(
          "en-US",
          { hour: "numeric", minute: "numeric", hour12: true }
        )}: ${name}:${meal}: ${comment} :sugar ${sugar} : insulin ${insulin}</h5>
<div class="task-links">
<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      const userConfirmed = confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!userConfirmed) {
        // If the user cancels, prevent the delete action

        alert("Deletion canceled");
      } else {
        // Proceed with the deletion
        await axios.delete(`/api/tasks/${id}`);
        showTasks();
        alert("Item deleted successfully");
        // You can add your deletion logic here
      }
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputName.value;
  const meal = taskInputMeal.value;
  const comment = taskInputComment.value;
  const sugar = taskInputSugar.value;
  const insulin = taskInputInsulin.value;
  // const year = Number(tdate.substring(0, 4));
  // const month = Number(tdate.substring(5, 7));
  // const year_month = tdate.substring(5, 7) + "_" + tdate.substring(0, 4);
  // const date_string =
  //   tdate.substring(8, 10) +
  //   "_" +
  //   tdate.substring(5, 7) +
  //   "_" +
  //   tdate.substring(0, 4);
  try {
    const userConfirmed = confirm("Are you sure you want to Add this entry?");
    if (!userConfirmed) {
      // If the user cancels, prevent the delete action

      alert("Entry canceled");
    } else {
      // Proceed with the deletion

      await axios.post("/api/tasks", {
        name,
        meal,
        comment,
        sugar,
        insulin,
      });

      showTasks();
      alert("Entry Added successfully");
      // You can add your deletion logic here
    }

    taskInputName.value = "";
    taskInputMeal.value = "";
    taskInputComment.value = "";
    taskInputSugar.value = "";
    taskInputInsulin.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
