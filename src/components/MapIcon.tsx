import React from 'react';
import { renderToString } from 'react-dom/server';
import { TreeDeciduous, Droplets, User, Megaphone, Hammer, ShieldAlert, Truck, AlertTriangle } from 'lucide-react';

export const getIconString = (categoria: string, colorClass: string) => {
  let Icon = AlertTriangle;
  if (categoria === 'ARVORE_CAIDA') Icon = TreeDeciduous;
  if (categoria === 'BUEIRO') Icon = Droplets;
  if (categoria === 'MORADOR_RUA') Icon = User;
  if (categoria === 'BARULHO_PSIU') Icon = Megaphone;
  if (categoria === 'CALCADA' || categoria === 'TAPA_BURACO') Icon = Hammer;
  if (categoria === 'FISCALIZACAO_POSTURA') Icon = ShieldAlert;
  if (categoria === 'DESFAZIMENTO') Icon = Truck;

  return renderToString(
    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center ${colorClass} text-white`}>
      <Icon size={16} />
    </div>
  );
};
