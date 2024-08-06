class Base{
    constructor(base1){
        this.nombreBase=base1.nombreBase;
    }
    
    set nombreBase(nombreBase){
        var regexNombreBase = /^[A-Za-z0-9]+$/;
        if (regexNombreBase.test(nombreBase)){
            this._nombreBase=nombreBase;
        }
    };
    
    get nombreBase(){
        return this._nombreBase;
    };
    
}

module.exports=Base;