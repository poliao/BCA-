import { Injectable } from '@angular/core';

export interface CutResult {
  count: number;
  pw: number;
  pl: number;
  cw: number;
  cl: number;
  layout: CutBox[];
}

export interface CutBox {
  x: number;
  y: number;
  w: number;
  l: number;
  rotated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaperCutService {

  calculateBestCut(pw: number, pl: number, cw: number, cl: number): CutResult {
    // Basic validation
    if (!pw || !pl || !cw || !cl) return { count: 0, pw, pl, cw, cl, layout: [] };

    // Try both parent orientations
    const res1 = this.solve(pw, pl, cw, cl);
    const res2 = this.solve(pl, pw, cw, cl);

    return res1.count >= res2.count ? res1 : res2;
  }

  private solve(W: number, L: number, w: number, l: number): CutResult {
    const results: CutResult[] = [];

    // 1. All Normal Orientation
    results.push(this.layoutNormal(W, L, w, l));

    // 2. All Rotated Orientation
    results.push(this.layoutRotated(W, L, w, l));

    // 3. Mixed: Primary Normal, Remaining Rotated (Horizontal Split)
    // Try primary blocks of rows
    const maxVNormal = Math.floor(L / l);
    for (let i = 1; i <= maxVNormal; i++) {
        results.push(this.layoutMixedH(W, L, w, l, i));
    }

    // 4. Mixed: Primary Normal, Remaining Rotated (Vertical Split)
    const maxHNormal = Math.floor(W / w);
    for (let i = 1; i <= maxHNormal; i++) {
        results.push(this.layoutMixedV(W, L, w, l, i));
    }

    return results.sort((a, b) => b.count - a.count)[0];
  }

  private layoutNormal(W: number, L: number, w: number, l: number): CutResult {
    const nH = Math.floor(W / w);
    const nV = Math.floor(L / l);
    const layout: CutBox[] = [];
    for (let y = 0; y < nV; y++) {
      for (let x = 0; x < nH; x++) {
        layout.push({ x: x * w, y: y * l, w, l, rotated: false });
      }
    }
    return { count: layout.length, pw: W, pl: L, cw: w, cl: l, layout };
  }

  private layoutRotated(W: number, L: number, w: number, l: number): CutResult {
    const nH = Math.floor(W / l);
    const nV = Math.floor(L / w);
    const layout: CutBox[] = [];
    for (let y = 0; y < nV; y++) {
      for (let x = 0; x < nH; x++) {
        layout.push({ x: x * l, y: y * w, w: l, l: w, rotated: true });
      }
    }
    return { count: layout.length, pw: W, pl: L, cw: w, cl: l, layout };
  }

  private layoutMixedH(W: number, L: number, w: number, l: number, splitRows: number): CutResult {
    const layout: CutBox[] = [];
    const nH = Math.floor(W / w);
    const topHeight = splitRows * l;

    // Top section: Normal
    for (let y = 0; y < splitRows; y++) {
      for (let x = 0; x < nH; x++) {
        layout.push({ x: x * w, y: y * l, w, l, rotated: false });
      }
    }

    // Bottom section: Rotated
    const bottomHeight = L - topHeight;
    const rnH = Math.floor(W / l);
    const rnV = Math.floor(bottomHeight / w);
    for (let y = 0; y < rnV; y++) {
      for (let x = 0; x < rnH; x++) {
        layout.push({ x: x * l, y: topHeight + (y * w), w: l, l: w, rotated: true });
      }
    }

    return { count: layout.length, pw: W, pl: L, cw: w, cl: l, layout };
  }

  private layoutMixedV(W: number, L: number, w: number, l: number, splitCols: number): CutResult {
    const layout: CutBox[] = [];
    const nV = Math.floor(L / l);
    const leftWidth = splitCols * w;

    // Left section: Normal
    for (let y = 0; y < nV; y++) {
      for (let x = 0; x < splitCols; x++) {
        layout.push({ x: x * w, y: y * l, w, l, rotated: false });
      }
    }

    // Right section: Rotated
    const rightWidth = W - leftWidth;
    const rnH = Math.floor(rightWidth / l);
    const rnV = Math.floor(L / w);
    for (let y = 0; y < rnV; y++) {
      for (let x = 0; x < rnH; x++) {
        layout.push({ x: leftWidth + (x * l), y: y * w, w: l, l: w, rotated: true });
      }
    }

    return { count: layout.length, pw: W, pl: L, cw: w, cl: l, layout };
  }
}
