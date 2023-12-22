const list = document.getElementById('list');
const createBtn = document.getElementById('create-btn');


let todos = [];

//createBtn을 클릭하면 아래 createNewTodo()가 실행된다.
createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    //새로운 아이템 객체 생성
    const item = {
        id: new Date().getTime(),
        Text: "",
        complete: false
    }
    //배열 처음에 새로운 아이템 추가
    todos.unshift(item);
    //요소 생성하기
    //const itemEl = document.createElement('div');
    //const inputEl = document.createElement('input');
    //const editBtnEl = document.createElement('button');
    //const removeBtnEl = document.createElement('button');
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);
    
    //리스트 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl);
    //disabled 속성 제거(속성에 diasabled가 있으면 입력이 불가하도록 설정해놔서 없으면 todo 추가시 입력기능 활성화 안됨)
    inputEl.removeAttribute('disabled');
    //input 요소에 focus
    inputEl.focus();

    saveTolocalStorage();
}

function createTodoElement(item) {
    //itemEl 변수를 이용하여 div 요소 생성
    const itemEl = document.createElement('div');
    //class요소에 class 이름을 item으로 추가
    itemEl.classList.add('item');

    //checkboxEl 변수를 이용하여 input 요소 생성
    const checkboxEl = document.createElement('input');
    //checkbox 타입 지정
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete;
    


    if(item.complete) {
        itemEl.classList.add('complete');
    }
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.Text;
    //input 속성에 disabled가 있으면 입력 불가함
    inputEl.setAttribute('disabled','');

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons','remove-btn');
    removeBtnEl.innerText ='remove_circle';

    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked;

        if(item.complete) {
                itemEl.classList.add('complete');
        } 
        else {
                itemEl.classList.remove('complete');
            }
        saveTolocalStorage();
    })

    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', '');
        saveTolocalStorage();
    })

    inputEl.addEventListener('input', () => {
        item.Text = inputEl.value;
    })

    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
        saveTolocalStorage();
    })

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter(t => t.id !==item.id);
        itemEl.remove();
        saveTolocalStorage();
    })

    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);
        
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);

    itemEl.append(actionsEl);

    return {itemEl, inputEl, editBtnEl, removeBtnEl};
        
}
//데이터 저장하기
function saveTolocalStorage() {

    //자바스크립트를 스트링으로 변환
    const data = JSON.stringify(todos);

    window.localStorage.setItem('My_todos', data);
    //window 생략 가능 
}

//저장한 데이터 가져오기
function loadFromLocalStorage() {
    const data = localStorage.getItem('My_todos');

    if(data) {
        //스트링을 자바스크립트로 변환
        todos = JSON.parse(data);
    }
}

//요소 저장
function displayTodos() {
    loadFromLocalStorage();

    for(let i = 0; i < todos.length; i++) {
        const item = todos[i];
        const{itemEl} = createTodoElement(item);

        list.append(itemEl);
    }
}

displayTodos();
