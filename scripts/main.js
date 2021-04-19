/*
* @author Gustavo Alberto Valladares Sagrero <gvalladares@ucol.mx>
* @author Darlene Vanessa Moreno <dmoreno9@ucol.mx>
* @version 1.0
* @file Script to calculate interpolations.
* @copyright Alberto Sagrero and Darlene Moreno 2021
*/



var isPortraitDevice;
var scrollPercent = 0;
$(document).on("scroll", (e) =>{
    scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
    if( $(window).width() < $(window).height() )
    {
        isPortraitDevice = true;
        if( scrollPercent >= 72)
        {
            $(".selectContainer").css({
                'background':'rgba(0,0,0,0.6)'
            });
            $("#selectMobil").css({
                'background':'rgba(2, 49 ,54, 0.8)',
                'border':'2px solid orange'
            });
        }else
        {
            $(".selectContainer").css({
                'background':'rgba(0,0,0,0.0)'
            });
            $("#selectMobil").css({
                'background':'#356772',
                'border':'1px solid #000'
            });
        }
    }else
    {
        isPortraitDevice = false;
        if( scrollPercent >= 43)
        {
            $(".selectContainer").css({
                'background':'rgba(0,0,0,0.6)'
            });
            $("#selectMobil").css({
                'background':'rgba(2, 49 ,54, 0.8)',
                'border':'2px solid orange'
            });
        }else
        {
            $(".selectContainer").css({
                'background':'rgba(0,0,0,0.0)'
            });
            $("#selectMobil").css({
                'background':'#356772',
                'border':'1px solid #000'
            });
        }       
    }

});


$(document).ready(main);

const INTERP = ["Seleccionar Interpolación","Interpolación Lineal","Interpolación Cuadrática","Interpolación Lagrange"];
var isMenuClosed = true;
var isDelBtnHide = true;
var optionTypeSelected = 0;
var optionBtnSelected = 0;
var lagrangeOption = 1;
var autoSelect = false;
 

//Table vars
var min_fields = 2;
var max_fields = -1;
var add_fields = ".btn_addData";
var del_lastfield = ".btn_delData";
var fields = min_fields;
var wrapper = $("#tableData");
var body_wrapper = $("#bodyData");
var fieldData = [];
var X = 0;
var FdXAprox;
var FdXExacta;




//Funcion para obtener valores de la tabla
//Los valores se guardan como un array donde el primer valor es el valor de x y el segundo de y
/*
Para llamar a cada valor de cada variable es de esta forma.
Si queremos llamar al valor de la variable x:
fieldData[0][0]

Si queremos llamar a l valor de la variable y:
fieldData[0][1]

*/
function getValues()
{
    X = parseFloat($("#XValor").val());
    fieldData.splice(0);
    let tempArray = [];
    $(body_wrapper).find("input").each( function(a,b,c) {
        tempArray.push($(this).val());
    });

    for(let i=0; i < tempArray.length; i++)
    {
        if(tempArray[i].startsWith("[log10]"))
        {
            let valor = Math.log10(parseFloat(tempArray[i].split(" ").join("").substr(tempArray[i].indexOf("]")+1)));
            fieldData.push( [parseFloat(valor), parseFloat(tempArray[++i])] );
        }else
        {
            fieldData.push( [parseFloat(tempArray[i]), parseFloat(tempArray[++i])] );
        }

    }    
}


//Esta funcion permite agregar campos a la tabla
function _tableData()
{
    if(fields < max_fields)
    {
        fields++;
        $(body_wrapper).append(`<tr><td><label><span>X<sub>${fields-1}</sub> = </span><input type="text" placeholder="Ej: 1"></label></td><td><label><span>F(X<sub>${fields-1}</sub>) = </span><input type="text" placeholder="Ej: 3"></label></td></tr>`);
    }

}


//Esta funcion permite eliminar el ultimo campo de la tabla
function _removeLastFieldTable()
{
    $("#bodyData tr").last().fadeOut(600, function(){
        $(this).remove();
        fields--;
    });   
}





//Esta funcion permite abrir y cerrar el menu lateral
function _toggle_menubar()
{
    $("#toggle-menu").click(function(){
        
        if(isMenuClosed)
        {
            $('nav').animate({
                left: '0'
            });
            isMenuClosed = false;
        }else
        {
            $('nav').animate({
                left: '-100%'
            });
            isMenuClosed = true;
        }

    });
}









//Esta funcion permite mostrar y actualizar la interpolación seleccionada
function _selectInterpolation(s)
{
    if(!isMenuClosed){
        $('nav').animate({
            left: '-100%'
        });
        isMenuClosed = true;
    }

    switch(s)
    {
        case 1:
        max_fields = 2;
        if(fields> max_fields)_removeLastFieldTable();
        $(".opLagrange").fadeOut(500);
        $(".OSelected").text(INTERP[s]);
        $("#OLineal").hide();
        $("#OCuadratica").show();
        $("#OLagrange").show();
        ;break;
        case 2: 
        max_fields = 3;
        if(fields < max_fields) _tableData();
        $(".OSelected").text(INTERP[s]);
        $(".opLagrange").fadeOut(500);
        $("#OCuadratica").hide();
        $("#OLineal").show();
        $("#OLagrange").show();
        ;break;
        case 3:
        max_fields = 3;
        if(lagrangeOption == 1)
        {
            $(".btn_delData").hide();
            $(".btn_addData").slideDown();
            if(fields> min_fields)_removeLastFieldTable();
        }else
        {
            if(fields < max_fields) _tableData();
            $(".btn_delData").slideDown();
            $(".btn_addData").hide();
        }
        $(".OSelected").text(INTERP[s]);
        $(".opLagrange").slideDown();
        $("#OLagrange").hide();
        $("#OLineal").show();
        $("#OCuadratica").show();
        ;break;
        default:
        max_fields = 2; 
        $(".OSelected").text(INTERP[0]);
        $(".opLagrange").slideUp();
        $("#OLagrange").show();
        $("#OLineal").show();
        $("#OCuadratica").show();
        ;break;
    }
}



//Porcentaje de error

function PorcError()
{
    $("#Ea").val(0);
    $("#Er").val(0);
    FdXExacta = parseFloat($("#YValor").val());


    /*
        Ev = FdXExacta - FdXAprox
        _EV = ( Ev / FdXExacta ) * 100 
    */

        let Ev = (Number((FdXExacta - FdXAprox).toFixed(5)));
        let _EV = (Number((( Ev / FdXExacta ) * 100).toFixed(5)));

        $("#Ea").val(Ev);
        $("#Er").val(_EV+"%");
        $(".margenError").fadeIn();
        window.scrollBy(0, $(".margenError").offset().top);
}

//Porcentaje de error FINAL


//Formulas INICIO


function InterpolacionLineal()
{
    getValues();
    FdXAprox = 0;
    FdXAprox = Number(((fieldData[0][1] + ((fieldData[1][1] - fieldData[0][1])/(fieldData[1][0]-fieldData[0][0])) * (X - fieldData[0][0]))).toFixed(5));
    $("#soluionY").val(FdXAprox);
    $(".fdx").fadeIn();
    window.scrollBy(0, $("#soluionY").offset().top);

    if($("#YValor").val() != "")
    {
        
        PorcError();
    }
 }




function InterpolacionCuadratica()
{
    getValues();
    FdXAprox = 0;
    /*
        Formula cuadratica
        F(x) = B0 + B1(x-x0) + B2(x-x0)(x-x1)
        B0 = F(X0)
        B1 = (( F(X1) - F(X0) ) / ( X1 - X0 ))
        B2 = ((((F(X2) - F(X1)) / (X2 - X1)) - ((F(X1) - F(X0)) / (X1 - X0))) / (X2 - X0))
    */

        let B0 = fieldData[0][1];
        let B1 = (( fieldData[1][1] - fieldData[0][1] ) / ( fieldData[1][0] - fieldData[0][0] ));
        let B2 = ((((fieldData[2][1] - fieldData[1][1]) / (fieldData[2][0] - fieldData[1][0])) - ((fieldData[1][1] - fieldData[0][1]) / (fieldData[1][0] - fieldData[0][0]))) / (fieldData[2][0] - fieldData[0][0]));
        FdXAprox = Number((B0 + (B1 * (X - fieldData[0][0])) + (B2 * (X - fieldData[0][0]) * (X - fieldData[1][0]))).toFixed(5));
        $("#soluionY").val(FdXAprox);
        $(".fdx").fadeIn();
        window.scrollBy(0, $("#soluionY").offset().top);

        if($("#YValor").val() != "")
        {
            PorcError();
        }
     }




function InterpolacionLagrange_Grado1()
{
    getValues();
    FdXAprox = 0;
    /*
        Formula primer grado
        F(X) = (((X - X1) / (X0 - X1)) * F(X0)) + (((X - X0) / (X1 - X0)) * F(X1))
    */
   FdXAprox = Number(((((X - fieldData[1][0]) / (fieldData[0][0] - fieldData[1][0])) * fieldData[0][1]) + (((X - fieldData[0][0]) / (fieldData[1][0] - fieldData[0][0])) * fieldData[1][1])).toFixed(5));
   $("#soluionY").val(FdXAprox);
   $(".fdx").fadeIn();
   window.scrollBy(0, $("#soluionY").offset().top);

   if($("#YValor").val() != "")
   {
       PorcError();
   }
}

function InterpolacionLagrange_Grado2()
{
    getValues();
    FdXAprox = 0;
    /*
        Formula segundo grado
        F(X) = ( L0 * F(X0) ) + ( L1 * F(X1) ) + ( L2 * F(X2) ) 
        L0 = (( ((X - X1) / (X0 - X1)) * ((X - X2) / (X0 - X2)) ))
        L1 = (( ((X - X0) / (X1 - X0)) * ((X - X2) / (X1 - X2)) ))
        L2 = (( ((X - X0) / (X2 - X0)) * ((X - X1) / (X2 - X1)) ))
    */

        let L0 = (( ((X - fieldData[1][0]) / (fieldData[0][0] - fieldData[1][0])) * ((X - fieldData[2][0]) / (fieldData[0][0] - fieldData[2][0])) ));
        let L1 = (( ((X - fieldData[0][0]) / (fieldData[1][0] - fieldData[0][0])) * ((X - fieldData[2][0]) / (fieldData[1][0] - fieldData[2][0])) ));
        let L2 = (( ((X - fieldData[0][0]) / (fieldData[2][0] - fieldData[0][0])) * ((X - fieldData[1][0]) / (fieldData[2][0] - fieldData[1][0])) ));
        FdXAprox = Number(((L0 * fieldData[0][1]) + (L1 * fieldData[1][1]) + (L2 * fieldData[2][1])).toFixed(5));
        $("#soluionY").val(FdXAprox);
        $(".fdx").fadeIn();
        window.scrollBy(0, $("#soluionY").offset().top);

        if($("#YValor").val() != "")
        {
            PorcError();
        }
     }







//Formulas FINAL


//Esta funcion permite procesar la accion al darle clic en el boton calcular o resetear
function ProcesarAccion(s)
{
    if(s == '1')
    {
        switch(optionTypeSelected)
        {
            case 1: InterpolacionLineal();break;
            case 2: InterpolacionCuadratica();break;
            case 3: 
            if(lagrangeOption == 1)
            {
                InterpolacionLagrange_Grado1();
            }else
            {
                InterpolacionLagrange_Grado2();
            }
            ;break;
            default: alert("¡Debe seleccionar un tipo de interpolación!");break;
        }
    }else if(s == '2')
    {
        $(".resultInterpolacion").fadeOut();
        $("#soluionY").val(0);
        $("#Ea").val(0);
        $("#Er").val(0);
        $("#XValor").val("");
        $("#YValor").val("");
        $('.inputData').trigger("reset");
    }
}


//Esta funcion permite cambiar y actualizar el tipo de interpolación de Lagrange.
function _toggleLagrange(s)
{

    switch(s)
    {
        case 1:
        $(".btn_addData").fadeIn(500);
        $(".btn_delData").hide();
        if(fields > min_fields)
        {
            _removeLastFieldTable();
        }break;
        case 2: 
        $(".btn_delData").fadeIn(500);
        $(".btn_addData").hide();
        if(optionTypeSelected > 0)
        {
            _tableData();
        }else
        {
            alert("¡Debe seleccionar un tipo de interpolación!");
        }break;
        default: ;break; 
    }
}





/*
 * La funcion principal o main permite la correcta ejecución de las funciones. 
 * Una vez que los elementos hayan sido cargados correctamente.
 */
function main()
{

    //LLams a la funcion para abrir/cerrar el menu lateral
    _toggle_menubar();

   $("#selectMobil").change( (v) =>{
        let selected = parseInt(v.target.value);
        optionTypeSelected = selected;
        _selectInterpolation(optionTypeSelected);
   });
    


   //Este handle de los eventos click, permite detectar que botones con un data-control
   //especifico a llamado a ese evento.
    $("body").click((e) => {
        e.preventDefault();
        let control = e.target.dataset.control;
        switch(control)
        {
            case 'btn-gitAlberto':location.href="https://github.com/GustavoAlbertoValladaresSagrero99";break;
            case 'btn-gitDarlene':location.href="https://github.com/Darlenevm";break;
            case 'btn-inicio':location.href="./index.html";break;
            case 'btn-tutos':location.href="./tutorial.html";break;
            case 'btn-about':location.href="./about.html";break;
            case 'btn-1': optionTypeSelected = 1;break;
            case 'btn-2': optionTypeSelected = 2;break;
            case 'btn-3': optionTypeSelected = 3;break;
            case 'btn-4': lagrangeOption = 1;break;
            case 'btn-5': lagrangeOption = 2;break;
            case 'btn-6': optionBtnSelected = 1;break;
            case 'btn-7': optionBtnSelected = 2;break;
            default: ;break;
        }

        if(control == 'btn-1' || control == 'btn-2' || control == 'btn-3'){_selectInterpolation(optionTypeSelected);
            $(`#selectMobil option[value='${optionTypeSelected}']`).prop('selected', true);
        }
        else if(control == 'btn-4' || control == 'btn-5') {_toggleLagrange(lagrangeOption);}
        else if(control == 'btn-6' || control == 'btn-7') {ProcesarAccion(optionBtnSelected);}

    });



}