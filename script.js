// ==========================================
// ELEMENTOS DEL FORMULARIO DEL CLIENTE
// ==========================================

const clienteForm = document.getElementById("cliente-form");
const btnContinuar = document.getElementById("btn-continuar");

const seccionCredito =
    document.getElementById("seccion-credito");


// ==========================================
// ELEMENTOS DEL FORMULARIO DE CRÉDITO
// ==========================================

const form = document.getElementById("credit-form");

const montoInput =
    document.getElementById("monto");

const tasaInput =
    document.getElementById("tasa");

const plazoInput =
    document.getElementById("plazo");


// ==========================================
// ELEMENTOS DE RESULTADOS
// ==========================================

const tablaBody =
    document.querySelector("#tabla-amortizacion tbody");

const pagoInicial =
    document.getElementById("pago-inicial");

const totalIntereses =
    document.getElementById("total-intereses");

const totalIVA =
    document.getElementById("total-iva");

const totalPagar =
    document.getElementById("total-pagar");


// ==========================================
// FORMATO DE MONEDA
// ==========================================

const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
});


// ==========================================
// OCULTAR CRÉDITO AL INICIO
// ==========================================

seccionCredito.style.display = "none";


// ==========================================
// CONTINUAR CON LA SOLICITUD
// ==========================================

btnContinuar.addEventListener("click", () => {

    // Comprobar datos del cliente

    if (!clienteForm.checkValidity()) {

        clienteForm.reportValidity();

        return;
    }


    // Mostrar sección de crédito

    seccionCredito.style.display = "block";


    // Desplazar hacia la sección

    seccionCredito.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


// ==========================================
// CALCULAR CRÉDITO
// ==========================================

form.addEventListener("submit", (event) => {

    event.preventDefault();

    calcularCredito();

});


// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

function calcularCredito() {

    const monto =
        Number(montoInput.value);

    const tasaAnual =
        Number(tasaInput.value);

    const plazo =
        Number(plazoInput.value);


    // ======================================
    // VALIDACIONES
    // ======================================

    if (!Number.isFinite(monto) || monto <= 0) {

        alert("Ingrese un monto de crédito válido.");

        montoInput.focus();

        return;
    }


    if (!Number.isFinite(tasaAnual) || tasaAnual < 0) {

        alert("Ingrese una tasa de interés válida.");

        tasaInput.focus();

        return;
    }


    if (!Number.isInteger(plazo) || plazo <= 0) {

        alert("Seleccione un plazo válido.");

        plazoInput.focus();

        return;
    }


    // ======================================
    // CONFIGURACIÓN
    // ======================================

    const IVA = 0.16;


    // Tasa mensual

    const tasaMensual =
        (tasaAnual / 100) / 12;


    // Capital que se paga cada mes

    const capitalMensual =
        monto / plazo;


    // ======================================
    // VARIABLES
    // ======================================

    let saldo =
        monto;

    let interesesTotales =
        0;

    let ivaTotal =
        0;

    let pagosTotales =
        0;


    // Limpiar tabla

    tablaBody.innerHTML = "";


    // ======================================
    // GENERAR AMORTIZACIÓN
    // ======================================

    for (
        let periodo = 1;
        periodo <= plazo;
        periodo++
    ) {

        const saldoInicial =
            saldo;


        // Interés del periodo

        const interes =
            saldoInicial * tasaMensual;


        // IVA del interés

        const iva =
            interes * IVA;


        // Capital

        let capital =
            capitalMensual;


        // Último pago

        if (periodo === plazo) {

            capital =
                saldoInicial;
        }


        // Pago total

        const pagoTotal =
            capital +
            interes +
            iva;


        // Saldo restante

        const saldoFinal =
            Math.max(
                0,
                saldoInicial - capital
            );


        // ==================================
        // ACUMULAR
        // ==================================

        interesesTotales +=
            interes;

        ivaTotal +=
            iva;

        pagosTotales +=
            pagoTotal;


        // ==================================
        // CREAR FILA
        // ==================================

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${periodo}
            </td>

            <td>
                ${formatoMoneda.format(
                    saldoInicial
                )}
            </td>

            <td>
                ${formatoMoneda.format(
                    capital
                )}
            </td>

            <td>
                ${formatoMoneda.format(
                    interes
                )}
            </td>

            <td>
                ${formatoMoneda.format(
                    iva
                )}
            </td>

            <td>
                ${formatoMoneda.format(
                    pagoTotal
                )}
            </td>

            <td>
                ${formatoMoneda.format(
                    saldoFinal
                )}
            </td>

        `;


        tablaBody.appendChild(fila);


        // Actualizar saldo

        saldo =
            saldoFinal;
    }


    // ======================================
    // MOSTRAR PRIMER PAGO
    // ======================================

    const primeraFila =
        tablaBody.querySelector("tr");


    if (primeraFila) {

        const celdas =
            primeraFila.querySelectorAll("td");


        // La columna 5 es Pago Total

        pagoInicial.textContent =
            celdas[5].textContent.trim();
    }


    // ======================================
    // MOSTRAR TOTALES
    // ======================================

    totalIntereses.textContent =
        formatoMoneda.format(
            interesesTotales
        );


    totalIVA.textContent =
        formatoMoneda.format(
            ivaTotal
        );


    totalPagar.textContent =
        formatoMoneda.format(
            pagosTotales
        );


    // ======================================
    // MOSTRAR RESULTADOS
    // ======================================

    const resultados =
        document.getElementById("resultados");


    resultados.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
