import { ITelegramContext } from "../../controllers/start";

export function getActionParams(ctx: ITelegramContext): string[] {
  const args = (ctx.match?.input || "")
    .split(" ")
    .slice(1, ctx.match?.input.split(" ").length);

  return args as string[];
}

export function currencyFormat(number: number, symbol?: true) {
  const UAH = "₴";

  if (symbol) {
    const result = number.toLocaleString("ru-RU");
    return result + " " + UAH;
  }

  const result = number.toLocaleString("uk-UK", {
    style: "currency",
    currency: "UAH",
  });

  return result; //TODO: try to implement formating myself
}
