commands = [];
commandPreset = `
    <span onclick="ren({{id}})">{{name}}</span>
    <a onclick="del({{id}})" class="btn">✖️</a>
    <a onclick="down({{id}})" class="btn">⬇️</a>
    <a onclick="up({{id}})" class="btn">⬆️</a>`;
curCId = 0;
curTick = 0;
curStep = 0;

function addN() {
    commands[curTick][curStep].queue.push(
        {
            id: curCId++,
            type: "normal",
            name: "normal"
        }
    );
    refresh();
}

function addS() {
    commands[curTick][curStep].queue.push(
        {
            id: curCId++,
            type: "strong",
            name: "strong"
        }
    );
    refresh();
}

function del(n) {
    let interfaced = commands[curTick][curStep].interfaced;
    commands[curTick][curStep].queue = commands[curTick][curStep].queue.filter(x => x.id !== n);
    commands[curTick][curStep].interfaced = interfaced;
    refresh();
}

function down(n) {    
    let interfaced = commands[curTick][curStep].interfaced;
    let command = commands[curTick][curStep].queue.filter(x => x.id === n)[0];
    console.log(command);
    let index = commands[curTick][curStep].queue.indexOf(command);
    commands[curTick][curStep].queue = commands[curTick][curStep].queue.filter(x => x.id !== n);
    if (index === commands[curTick][curStep].queue.length)
        commands[curTick][curStep].queue.splice(0, 0, command);
    else
        commands[curTick][curStep].queue.splice(index+1, 0, command);
    commands[curTick][curStep].interfaced = interfaced;
    refresh();
}

function up(n) {    
    let interfaced = commands[curTick][curStep].interfaced;
    let command = commands[curTick][curStep].queue.filter(x => x.id === n)[0];
    console.log(command);
    let index = commands[curTick][curStep].queue.indexOf(command);
    commands[curTick][curStep].queue = commands[curTick][curStep].queue.filter(x => x.id !== n);
    if (index === 0)
        commands[curTick][curStep].queue.splice(commands[curTick][curStep].queue.length, 0, command);
    else
        commands[curTick][curStep].queue.splice(index-1, 0, command);
    commands[curTick][curStep].interfaced = interfaced;
    refresh();
}

function ren(n) {
    let name = prompt("Editing name...", "");
    let command = commands[curTick][curStep].queue.filter(x => x.id === n)[0];
    if (name !== "")
        command.name = name;
    refresh();
}

function interfaced() {
    commands[curTick][curStep].interfaced = !commands[curTick][curStep].interfaced;
    refresh();
}

function refresh() {
    document.getElementById("ticknumber").innerHTML = curTick;
    document.getElementById("stepnumber").innerHTML = curStep;
    let queue = document.getElementById("queue");
    queue.textContent = '';
    commands[curTick][curStep].queue.forEach(command => {
        let commandNode = document.createElement('li');
        commandNode.setAttribute("class", command.type);
        commandNode.innerHTML = commandPreset
            .replaceAll("{{name}}", command.name)
            .replaceAll("{{id}}", command.id);
        queue.appendChild(commandNode);
    });
    let interfaced = document.getElementById("interfaced");
    interfaced.innerHTML = commands[curTick][curStep].interfaced ?? false;    
    let intcol = document.getElementById("intcol");
    intcol.className = commands[curTick][curStep].interfaced ? "interfaced" : undefined;
    console.log(commands[curTick][curStep].queue);
}

function init() {
    if (commands[curTick] == null)
        commands[curTick] = [];

    if (commands[curTick][curStep] == null) {
        commands[curTick][curStep] = {};
        commands[curTick][curStep].queue = [];
        commands[curTick][curStep].interfaced = false;
        if (curTick === 0 && curStep === 0)
            addN();
    }
    refresh();
}

function prevTick() {
    if (curTick !== 0) {
        curTick--;
        curStep = 0;
        init();
    }
}

function prevStep() {
    if (curStep !== 0)
        curStep--;
        init();
}

function nextTick() {
    curTick++;
    curStep = 0;
    init();
}

function nextStep() {
    curStep++;
    init();
}

function exp() {
    document.getElementById("exportfield").value = JSON.stringify(commands);
}

function imp() {
    commands = JSON.parse(document.getElementById("exportfield").value);
    curTick = 0;
    curStep = 0;
    refresh();
}