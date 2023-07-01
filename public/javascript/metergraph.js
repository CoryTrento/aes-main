const canvas_arr = [];
const offset_arr = [];
const color_arr = [];

let holder_arr = [];
let holder_color = [];
const month_offset = $(".month_offset");

month_offset.each((i, value) => {
  let target = value.dataset.target;
  if (canvas_arr.indexOf(target) === -1) {
    canvas_arr.push(target);
  }

  let push_value = Number(value.dataset.offset);
  if (push_value < 0) {
    holder_color.push("rgba(16, 114, 3, .5)");
  } else {
    holder_color.push("rgba(234, 16, 16, .5)");
  }

  holder_arr.push(push_value);
  if (i !== 0 && (i + 1) % 12 === 0) {
    offset_arr.push(holder_arr);
    color_arr.push(holder_color);
    holder_arr = [];
    holder_color = [];
  }
});

canvas_arr.forEach((canvas, i) => {
  let ctx = document.getElementById(canvas).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      datasets: [
        {
          label: "Net Usage",
          data: offset_arr[i],
          backgroundColor: color_arr[i],
          borderColor: color_arr[i],
          borderWidth: 1
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return value + "kWh";
              }
            }
          }
        ]
      }
    }
  });
});
