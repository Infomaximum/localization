import { assertSimple } from "@infomaximum/assert";
import { capitalize, isNumber } from "./utils";

/** Возможные языки приложения */
export enum ELanguages {
  ru = "ru",
  en = "en",
}

interface ICommonLocParams {
  /** Приводить первую букву локализации к верхнему регистру */
  capitalized?: boolean;
  /**  Явно заданный язык для выбора локализации */
  lang?: ELanguages;
}

interface ITemplateLocParams<T> extends ICommonLocParams {
  /** Параметры для функции шаблона локализации */
  templateData?: T;
}

interface IPluralLocParams extends ICommonLocParams {
  /** Если задан, то будет использоваться как количество для выбора локализации,
   * склонение которой зависит от числа */
  count: number;
}

/** Выводит необходимый тип параметров в зависимости от передаваемого объекта локализации */
export type TExtractLocalizationParams<T extends TLocalizationDescription> =
  T extends {
    [K in ELanguages]: (...args: infer P) => string;
  }
    ? ITemplateLocParams<P[0]>
    : T extends {
        [K in ELanguages]: TLocalizationPluralDescription;
      }
    ? IPluralLocParams
    : ICommonLocParams;

export type TLocalizationFunctionalDescription = (
  ...args: any[]
) => string | TLocalizationPluralDescription;

type TLocalizationPluralDescription = {
  s: string;
  p1: string;
  p2?: string;
};

export type TLocalizationDescription = Record<
  ELanguages,
  string | TLocalizationFunctionalDescription | TLocalizationPluralDescription
>;

export type TLocalizationParams = {
  /**  Язык для которого будут возвращаться локализации */
  language: ELanguages;
};

export interface ILocalizationProps
  extends Partial<ITemplateLocParams<unknown>>,
    Partial<IPluralLocParams> {}

export class Localization {
  public static Language = ELanguages;

  private static PluralType = {
    SINGULAR: "s",
    PLURAL_1: "p1",
    PLURAL_2: "p2",
  } as const;

  private static GetPlurableEn(
    count: number,
    locals: TLocalizationPluralDescription
  ) {
    if (count === 1) {
      return locals[Localization.PluralType.SINGULAR];
    }

    return locals[Localization.PluralType.PLURAL_1];
  }

  private static GetPlurableRu(
    count: number,
    locals: TLocalizationPluralDescription
  ) {
    const rest = count % 100;

    const pluralType = Localization.PluralType;

    if (rest > 10 && rest < 20) {
      return locals[pluralType.PLURAL_1];
    }
    switch (count % 10) {
      case 1:
        return locals[pluralType.SINGULAR];
      case 0:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return locals[pluralType.PLURAL_1];
      case 2:
      case 3:
      case 4:
        return locals[pluralType.PLURAL_2] || locals[pluralType.PLURAL_1];
      default:
        assertSimple(false, "Некорректный count");
    }
  }

  private language: ELanguages;

  constructor(params: TLocalizationParams) {
    this.language = params.language;
  }

  /** Возвращает установленный язык*/
  public getLanguage(): ELanguages {
    return this.language || this.getBrowserLanguage();
  }

  /**
   * Возвращает язык, заданный в браузере пользователя
   * @returns {ELanguages}
   */
  public getBrowserLanguage(): ELanguages {
    return (navigator.language || ELanguages.en)
      .substring(0, 2)
      .toLowerCase() as ELanguages;
  }

  /**
   * Возвращает строку, соответствующую переданной локализации и преобразованную
   * согласно параметрам
   * @param {TLocalizationDescription} loc
   * @param {ILocalizationProps} props
   * @returns {string}
   */
  public getLocalized<
    L extends TLocalizationDescription,
    P extends ILocalizationProps = TExtractLocalizationParams<L>
  >(loc: L, props?: P): string {
    assertSimple(!!loc, "Локализация не передана");

    const lang = props?.lang || this.getLanguage();

    const locForLang = loc[lang];

    assertSimple(!!locForLang, "Неподдерживаемый язык");

    if (typeof locForLang === "function" || typeof locForLang === "object") {
      assertSimple(
        !!props,
        `Не переданы дополнительные параметры для локализации`
      );
    }
    const computedLoc =
      typeof locForLang === "function"
        ? locForLang(props?.templateData)
        : locForLang;
    if (typeof computedLoc === "string") {
      return this.getMaybeCapitalized(computedLoc, props?.capitalized);
    }
    const isCapitalized = props?.capitalized;
    const count = isNumber(props?.count) ? Math.abs(props?.count ?? 1) : 1;

    switch (lang) {
      case Localization.Language.en:
        return this.getMaybeCapitalized(
          Localization.GetPlurableEn(count, computedLoc),
          isCapitalized
        );
      case Localization.Language.ru:
        return this.getMaybeCapitalized(
          Localization.GetPlurableRu(count, computedLoc),
          isCapitalized
        );
      default:
        assertSimple(false, "Неподдерживаемый язык");
    }
  }

  private getMaybeCapitalized(
    str: string,
    isCapitalized: boolean | undefined
  ): string {
    return isCapitalized ? capitalize(str) : str;
  }
}
