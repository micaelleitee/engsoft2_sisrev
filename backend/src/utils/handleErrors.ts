export function handleError(res: any, error: any) {
  console.error(error);
  return res.status(500).json({ message: "Erro interno", error });
}
