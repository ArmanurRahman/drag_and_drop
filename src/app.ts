//validation 
interface Validatable {
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?:number;
    max?: number;
    min?: number  
}

function validate(validableInput: Validatable){
    let isValid = true
    if(validableInput.required){
        isValid = isValid && validableInput.value.toString().trim().length !==0
    }
    if(validableInput.minLength != null && typeof validableInput.value === 'string'){
       isValid = isValid && validableInput.value.length > validableInput.minLength
    }
    if(validableInput.maxLength != null && typeof validableInput.value === 'string'){
        isValid = isValid && validableInput.value.length < validableInput.maxLength
     }
     if(validableInput.max != null && typeof validableInput.value === 'number'){
        isValid = isValid && validableInput.value < validableInput.max
     }
     if(validableInput.min != null && typeof validableInput.value === 'number'){
        isValid = isValid && validableInput.value > validableInput.min
     }
     return isValid
}

//autobind decorator
function autobind(_ : any, _2:string, descriptor: PropertyDescriptor){
    const orginalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor={
        configurable:true,
        get(){
            const boundFn = orginalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

class ProjectList{
    templateElement : HTMLTemplateElement
    hostElement: HTMLDivElement;
    element:HTMLElement;
    constructor(private type:'active'|'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement
        
        const importedNode = document.importNode(this.templateElement.content, true)

        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-projects`

        this.attact()
        this.renderContent()
    }

    private attact(){
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }

    private renderContent(){
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECT'
    }
}

class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element:HTMLFormElement;
    title: HTMLInputElement
    description: HTMLInputElement
    people: HTMLInputElement

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)

        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'
        this.title = this.element.querySelector('#title') as HTMLInputElement
        this.description = this.element.querySelector('#description') as HTMLInputElement
        this.people = this.element.querySelector('#people') as HTMLInputElement
        this.configure()
        this.attact()
    }

    private genarateUserInput():[string, string, string]|void{
        const enterTitle = this.title.value
        const enterDescription = this.description.value
        const enterPeople = this.people.value

        const titleValidable: Validatable = {
            value: enterTitle,
            required:true
        }
        const descriptionValidable: Validatable = {
            value: enterDescription,
            required:true,
            minLength:5
        }
        const peopleValidable: Validatable = {
            value: +enterPeople,
            required:true,
            min:1
        }

        if(!validate(titleValidable) 
        || !validate(descriptionValidable) 
        || !validate(peopleValidable) ){
            alert("Invalid input. Please try again")
            return
        }
        return [enterTitle, enterDescription, enterPeople]
    }

    private clearInputs(){
        this.title.value = ''
        this.description.value = ''
        this.people.value = ''
    }
    @autobind
    private submitHandler(event: Event){
        event.preventDefault()
        const userInput = this.genarateUserInput()
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput
            console.log(title, description, people);
            this.clearInputs()
        }
        
    }

    @autobind
    private configure(){
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attact(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prj = new ProjectInput()
const activeProject = new ProjectList('active')
const finishedProject = new ProjectList('finished')