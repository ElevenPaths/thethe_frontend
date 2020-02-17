function object_is_empty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function make_unique_list(element_arg, lower = true) {
  let element = element_arg;

  if (element === undefined || element === null) {
    return ["N/D"];
  }

  if (Array.isArray(element)) {
    element = Array.from(new Set(element.map(el => el.toLowerCase())));
  } else {
    if (lower) {
      element = [element.toLowerCase()];
    } else {
      element = [element];
    }
  }
  return element;
}

function from_python_time(python_time) {
  let date = new Date(python_time * 1000);

  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

/*
  params:
    ts number of milliseconds or seconds since epoch
*/
function timestamp_diff_from_now(ts) {
  if (ts < 1500000000000) ts *= 1000;

  let diff = Date.now() - ts;

  let days = Math.floor(diff / 1000 / 60 / 60 / 24);
  diff -= days * 1000 * 60 * 60 * 24;

  let hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;

  let minutes = Math.floor(diff / 1000 / 60 / 60);
  diff -= minutes * 1000 * 60;

  return { days: days, hours: hours, minutes: minutes };
}

async function copy_content(elem) {
  await navigator.clipboard.writeText(elem);
}

export {
  object_is_empty,
  make_unique_list,
  from_python_time,
  timestamp_diff_from_now,
  copy_content
};
