// src/viewModels/usePerfilViewModel.ts
import { useEffect, useState } from 'react';
import { PerfilUsuario } from '../models/perfilModel';

export function usePerfilViewModel() {
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);

  useEffect(() => {
    setUsuario({
      nome: 'Você',
      email: 'voce@email.com',
    });
  }, []);

  return {
    usuario,
  };
}
