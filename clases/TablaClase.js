
class Tabla{
    constructor(tabla1){
        this.tablaNombre=tabla1.tablaNombre;
        this.numeroCampos=tabla1.numeroCampos;
    }

    set tablaNombre(tablaNombre){
        var regexTablaNombre = /^[A-Za-z0-9]+$/;
        if (regexTablaNombre.test(tablaNombre)){
            this.tablaNombre=tablaNombre;
        }
    };

    set numeroCampos(numeroCampos){
        var regexNumeroCampos = /^\d+$/;
        if (regexNumeroCampos.test(numeroCampos)){
            this.numeroCampos=numeroCampos;
        }
    };

    set campo(campo){
        var regexCampo = /^[A-Za-z0-9]+$/;
        if (regexCampo.test(campo)){
            this.campo=campo;
        }
    };
    
    get campo(){
        return this._campo;
    };
    
    get tablaNombre(){
        return this._tablaNombre;
    };

    get numeroCampos(){
        return this._numeroCampos;
    };
}

module.exports=Tabla;
