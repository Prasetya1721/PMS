/**
 * sectionIcons.js
 * Diekstrak dari ShipParticularsView.jsx (peta ikon level modul).
 * Dipakai oleh ShipParticularsTabs dan ShipParticularsSections.
 */
import { Ship, Maximize2, Cpu, Fuel, Anchor, Radio, Shield, Users } from 'lucide-react';

export const SECTION_ICONS = {
  general: Ship,
  dimensions: Maximize2,
  machinery: Cpu,
  tanks: Fuel,
  deck: Anchor,
  navigation: Radio,
  safety: Shield,
  accommodation: Users
};
