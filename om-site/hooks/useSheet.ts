import useSWR from "swr";
import { getSheet } from "@/lib/api";

const fetcher = (sheet: string) => getSheet(sheet);

export function useIdentidade()  { return useSWR("identidade",  fetcher); }
export function useICP()         { return useSWR("icp",         fetcher); }
export function useComunicamos() { return useSWR("comunicamos", fetcher); }
export function useCategorias()  { return useSWR("categorias",  fetcher); }
export function useMateriais()   { return useSWR("materiais",   fetcher); }
export function useGanchos()     { return useSWR("ganchos",     fetcher); }
export function usePosts()       { return useSWR("posts",       fetcher); }
export function usePesquisas()   { return useSWR("pesquisas",   fetcher); }
