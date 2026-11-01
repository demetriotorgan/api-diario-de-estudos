export const validarDataRegistro = (valor: unknown): boolean => {
    if (typeof valor !== 'string') {
        return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }

    const data = new Date(`${valor}T00:00:00.000Z`);

    if (Number.isNaN(data.getTime())) {
        return false;
    }

    return data.toISOString().slice(0, 10) === valor;
};