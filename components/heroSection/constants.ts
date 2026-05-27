/**
 * The {@link heroCardVariant} constant
 * @description Allowed variants for the {@link HeroCard} component, controlling the icon trio shown
 */
export const heroCardVariant = {
  HOME: 'home',
  SOBRE: 'sobre',
  PROJETOS: 'projetos',
  CONTATO: 'contato',
  AJUDAR: 'ajudar',
} as const

/**
 * The {@link HeroCardVariant} type
 * @description Union of allowed {@link heroCardVariant} values
 */
export type HeroCardVariant = (typeof heroCardVariant)[keyof typeof heroCardVariant]

/**
 * The {@link heroCardImageAlt} constant
 * @description Per-variant alt text for the {@link HeroCard} cover image
 */
export const heroCardImageAlt = {
  [heroCardVariant.HOME]:
    'Crianças e jovens da Guiné-Bissau apoiados pelos projetos da DI MI PA BÔS',
  [heroCardVariant.SOBRE]: 'Equipa da DI MI PA BÔS em missão na Guiné-Bissau',
  [heroCardVariant.PROJETOS]: 'Beneficiários dos projetos sociais da DI MI PA BÔS na Guiné-Bissau',
  [heroCardVariant.CONTATO]: 'Voluntários da DI MI PA BÔS em contacto com a comunidade local',
  [heroCardVariant.AJUDAR]: 'Comunidade transformada pelo apoio dos doadores da DI MI PA BÔS',
} as const satisfies Record<HeroCardVariant, string>
