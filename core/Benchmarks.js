let forward_marker = { color: 'rgb(29, 80, 114)' };
let backward_marker = { color: 'rgb(37, 183, 235)' }
let memory_marker = { color: 'rgb(227,221,175)' }

export function sortModel(model) {
  let sorted = model.frameworks.sort(function (a, b) {
    return a.forward - b.forward
  })
  model.frameworks = sorted;
  return model;
}

export function getFrameworks(model) {
  return model.frameworks.map(function (frm) {
    return `${frm.name} v${frm.version} (${frm.libraries.map(function(lib) { return `${lib.name} v${lib.version}` }).join(', ')})`
  })
}

export function getFrameworksForward(model) {
  return model.frameworks.map(function (frm) {
    return frm.forward
  })
}

export function getFrameworksBackward(model) {
  return model.frameworks.map(function (frm) {
    return frm.backward
  })
}

export function getFrameworksMemory(model) {
  return model.frameworks.map(function (frm) {
    if (frm.memory) {
      return parseInt(frm.memory.replace('MB', ''))
    } else {
      return frm.memory
    }
  })
}

export function getTrace(counter, model) {
  model = sortModel(model);
  let frameworks = getFrameworks(model);
  let forward = getFrameworksForward(model);
  let backward = getFrameworksBackward(model);
  let memory = getFrameworksMemory(model);

  let forward_trace = {
    name: 'Forward',
    x: frameworks,
    y: forward,
    xaxis: `x${counter}`,
    yaxis: `y${counter}`,
    marker: forward_marker,
    type: 'bar',
    showlegend: false
  };

  let backward_trace = {
    name: 'Backward',
    x: frameworks,
    y: backward,
    xaxis: `x${counter}`,
    yaxis: `y${counter}`,
    marker: backward_marker,
    type: 'bar',
    showlegend: false
  };

  let memory_trace = {
    name: 'Memory Usage',
    x: frameworks,
    y: memory,
    xaxis: `x${counter + 1}`,
    yaxis: `y${counter + 1}`,
    marker: memory_marker,
    type: 'bar',
    showlegend: false
  }

  return {
    forward: forward_trace,
    backward: backward_trace,
    memory: memory_trace
  }
}
