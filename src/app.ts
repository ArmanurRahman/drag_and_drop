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

    private submitHandler(event: Event){
        event.preventDefault()
        console.log(this.title.value);
        
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
