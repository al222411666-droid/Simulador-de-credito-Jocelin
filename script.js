const form = document.getElementById("credit-form");

const montoInput = document.getElementById("monto");
const tasaInput = document.getElementById("tasa");
const plazoInput = document.getElementById("plazo");

const tablaBody = document.querySelector(
    "#tabla-amortizacion tbody"
);

const pagoInicial = document.getElementById("pago-inicial");
const totalIntereses = document.getElementById("total-intereses");
const totalIVA = document.getElementById("total-iva");
const totalPagar = document.getElementById("total-pagar");


/*
    FORMATO DE MONEDA
*/

const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
});


/*
    EVENTO DEL FORMULARIO
*/

form.addEventListener("submit", function (event) {

    event.preventDefault();

    procesarSimulacion();

});


/*
    FUNCIÓN PRINCIPAL
*/

function procesarSimulacion() {

    const monto = parseFloat(montoInput.value);

    const tasaAnual = parseFloat(tasaInput.value);

    const plazo = parseInt(plazoInput.value);


    /*
        IVA SOBRE INTERESES
    */

    const IVA_VALOR = 0.16;


    /*
        VALIDACIÓN
    */

    if (
        !Number.isFinite(monto) ||
        !Number.isFinite(tasaAnual) ||
        !Number.isInteger(plazo)
    ) {

        alert("Ingrese valores numéricos válidos.");

        return;
    }


    if (monto <= 0) {

        alert("El monto debe ser mayor a $0.");

        return;
    }


    if (tasaAnual < 0) {

        alert("La tasa no puede ser negativa.");

        return;
    }


    if (plazo <= 0) {

        alert("El plazo debe ser mayor a cero.");

        return;
    }


    /*
        TASA MENSUAL
    */

    const tasaMensual =
        (tasaAnual / 100) / 12;


    /*
        CAPITAL CONSTANTE

        El capital se divide entre
        todos los meses.
    */

    const amortizacionCapital =
        monto / plazo;


    /*
        VARIABLES ACUMULADORAS
    */

    let saldoInsoluto = monto;

    let acumuladoIntereses = 0;

    let acumuladoIVA = 0;

    let acumuladoPagos = 0;


    /*
        LIMPIAR TABLA
    */

    tablaBody.innerHTML = "";


    /*
        GENERAR TABLA
    */

    for (
        let periodo = 1;
        periodo <= plazo;
        periodo++
    ) {

        /*
            SALDO INICIAL
        */

        const saldoInicial = saldoInsoluto;


        /*
            INTERÉS DEL MES
        */

        const interes =
            saldoInicial * tasaMensual;


        /*
            IVA SOBRE EL INTERÉS
        */

        const iva =
            interes * IVA_VALOR;


        /*
            CAPITAL

            En el último periodo utilizamos
            todo el saldo restante para evitar
            problemas de redondeo.
        */

        const capital =
            periodo === plazo
                ? saldoInicial
                : amortizacionCapital;


        /*
            PAGO TOTAL
        */

        const pagoTotal =
            capital +
            interes +
            iva;


        /*
            SALDO FINAL
        */

        const saldoFinal =
            Math.max(
                0,
                saldoInicial - capital
            );


        /*
            ACUMULADOS
        */

        acumuladoIntereses += interes;

        acumuladoIVA += iva;

        acumuladoPagos += pagoTotal;


        /*
            CREAR FILA
        */

        const fila =
            document.createElement("tr");


        fila.innerHTML = `
            <td>${periodo}</td>

            <td>
                ${formatoMoneda.format(saldoInicial)}
            </td>

            <td>
                ${formatoMoneda.format(capital)}
            </td>

            <td>
                ${formatoMoneda.format(interes)}
            </td>

            <td>
                ${formatoMoneda.format(iva)}
            </td>

            <td>
                ${formatoMoneda.format(pagoTotal)}
            </td>

            <td>
                ${formatoMoneda.format(saldoFinal)}
            </td>
        `;


        /*
            AGREGAR FILA A LA TABLA
        */

        tablaBody.appendChild(fila);


        /*
            ACTUALIZAR SALDO
        */

        saldoInsoluto = saldoFinal;
    }


    /*
        MOSTRAR PRIMER PAGO
    */

    const primeraFila =
        tablaBody.querySelector("tr");


    if (primeraFila) {

        const celdas =
            primeraFila.querySelectorAll("td");

        pagoInicial.textContent =
            celdas[5].textContent;
    }


    /*
        MOSTRAR TOTALES
    */

    totalIntereses.textContent =
        formatoMoneda.format(
            acumuladoIntereses
        );


    totalIVA.textContent =
        formatoMoneda.format(
            acumuladoIVA
        );


    totalPagar.textContent =
        formatoMoneda.format(
            acumuladoPagos
        );
}
