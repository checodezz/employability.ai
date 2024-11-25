declare module "bcryptjs" {
  export function hash(
    value: string,
    saltOrRounds: number | string
  ): Promise<string>;
  export function hashSync(
    value: string,
    saltOrRounds: number | string
  ): string;
  export function compare(value: string, hash: string): Promise<boolean>;
  export function compareSync(value: string, hash: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
}
