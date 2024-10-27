class Todo{
    constructor(){
        this.tasks=JSON.parse(localStorage.getItem('tasks')) || [];
        this.term='';
        this.draw();
    }

    addTask(taskText, dueDate){
        if(taskText.length>=3 && taskText.length<=255){
            this.tasks.push({text: taskText, date: dueDate});
            this.saveTasks();
            this.draw();
        } else if(taskText.length<3){
            alert("zadanie ma za mało znaków");
        } else if(taskText.length>255){
            alert("zadanie ma zbyt wiele znaków");
        }
    }

    editTask(indeks, newText){
        if(newText.length>=3 && newText.length<=255){
            this.tasks[indeks].text=newText;
            this.tasks[indeks].date=newDate;
            this.saveTasks();
            this.draw();
        } else if(newText.length<3){
            alert("zadanie ma za mało znaków");
        } else if(newText.length>255){
            alert("zadanie ma zbyt wiele znaków");
        }
    }

    deleteTask(indeks){
        this.tasks.splice(indeks, 1);
        this.saveTasks();
        this.draw();
    }

    saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    draw(){
        const taskList=document.getElementById('task-list');
        taskList.innerHTML='';
        const filteredTasks=this.filteredTasks;

        filteredTasks.forEach((task, indeks)=>{
            const li=document.createElement('li');
            const taskSpan=document.createElement('span');
            taskSpan.innerHTML=this.highlightText(task.text, this.term);
            taskSpan.contentEditable=true;

            const dueDateInput=document.createElement('input');
            dueDateInput.type='date';
            dueDateInput.value=task.date || '';
            dueDateInput.classList.add('kalendarz');

            taskSpan.addEventListener('blur', () => {
                const newText=taskSpan.textContent;
                const newDate=dueDateInput.value;
                this.editTask(indeks, newText);
            });

            const dueDateSpan=document.createElement('span');
            dueDateSpan.textContent=task.date ? `${task.date}` : '';

            const deleteBtn=document.createElement('button');
            deleteBtn.textContent='usuń';
            deleteBtn.classList.add('delete-task');
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(indeks);
            });

            li.appendChild(taskSpan);
            li.appendChild(dueDateInput);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    get filteredTasks() {
        if(this.term.length<2){
            return this.tasks;
        }
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    highlightText(text, term){
        if(!term) return text;
        const regex=new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
}

const todo=new Todo();

document.getElementById('search').addEventListener('input', (e)=>{
    const term=e.target.value;
    todo.term=term;
    todo.draw();
});

document.getElementById('add-task').addEventListener('click', ()=>{
    const taskText=document.getElementById('new-task').value;
    const dueDate=document.getElementById('due-date').value;
    todo.addTask(taskText, dueDate);
    document.getElementById('new-task').value='';
    document.getElementById('due-date').value='';
});

document.getElementById('search').addEventListener('input', (e) => {
    const term = e.target.value;
    todo.term = term;
    todo.draw();
});
