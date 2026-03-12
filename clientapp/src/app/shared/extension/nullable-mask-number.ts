import IMask, { Masked, MaskedNumber, MaskedNumberOptions } from 'imask';

export class NullableMaskedNumber extends IMask.MaskedNumber {
    static override readonly DEFAULTS = {
        ...Masked.DEFAULTS,
        mask: Number,
        radix: ',',
        thousandsSeparator: '',
        mapToRadix: [MaskedNumber.UNMASKED_RADIX],
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        scale: 2,
        normalizeZeros: true,
        padFractionalZeros: false,
        parse: Number,
        format: (n: {
            toLocaleString: (arg0: string, arg1: { useGrouping: boolean; maximumFractionDigits: number; }) => any;
        }) => n == null || n === undefined ? '' : n.toLocaleString('en-US', {
            useGrouping: false,
            maximumFractionDigits: 20
        })
    };

    // @ts-ignore
    get typedValue() {
        return this.unmaskedValue !== ''
            ? super.typedValue
            : null;
    }

    override set typedValue(num) {
        super.typedValue = num;
    }

    constructor(opts?: MaskedNumberOptions) {
        super({
            ...NullableMaskedNumber.DEFAULTS,
            ...opts,
        });
    }
}