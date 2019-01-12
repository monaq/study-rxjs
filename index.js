const input = document.getElementById('search');
const targetEl = document.getElementById('prompt');

Observable
.fromEvent(input, 'input')
.map((e) => e.target.value)
.filter(containsString('권단비'))
.map((value) => `<b>${value}</b>`)
.subscribe({
    next: (value) => {
        targetEl.innerHTML = value;
    }
});

function containsString(str) {
    return (input) => input.includes(str);
}
