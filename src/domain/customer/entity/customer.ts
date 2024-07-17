//O ESTADO DEVE ESTAR SEMPRE CONSISTENTE, VALORES OBRIGATÓRIOS DEVEM SEMPRE ESTAR PRESENTES
//SEMPRE DEVE SE AUTOVALIDAR
//DESCONFIE DE SETS 

import EventDispatcherInterface from "../../../@shared/event/event-dispatcher.interface";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../value_object/address";

//FOCADO EM NEGOCIO, NAO EM PERSISTENCIA. PARA PERSISTENCIA UTILIZAR OUTRO OBJETO/MODEL
export default class Customer{
    private _id: string;
    private  _name: string;
    private _address!: Address;
    private _rewardPoints: number = 0;
    private _active: boolean = false;

    constructor(id: string, name: string){
        this._id = id;
        this._name = name;
        this.validate();
    }


    
    static create(id: string, name: string, eventDispatcher: EventDispatcherInterface) {
        const customer = new Customer(id, name);
        eventDispatcher.notify(new CustomerCreatedEvent({id, name}));    
        return customer
      }

    changeAddress(address: Address){
        this._address = address;
        this.validate();
    }

    changeAddressWithEvent(address: Address, eventDispatcher: EventDispatcherInterface){
        this._address = address;
        this.validate();
        eventDispatcher.notify(new CustomerAddressChangedEvent({id: this.id, name: this.name, address: address}));    
    }

    validate(){
        if (this._name.length === 0){
            throw new Error("Name is required");
        }
        if (this._id.length === 0){
            throw new Error("Id is required");
        }
    }

    activate(){
        if(this._address === undefined){
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate(){
        this._active = false;
    }

    changeName(name: string){
        this._name = name;
        this.validate();
    }

    get id(): string{
        return this._id;
    }
    get name(): string{
        return this._name;
    }
    get address(): Address{
        return this._address;
    }


    get rewardPoints(): number{
        return this._rewardPoints;
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }

    isActive(): boolean{
        return this._active;
    }
}