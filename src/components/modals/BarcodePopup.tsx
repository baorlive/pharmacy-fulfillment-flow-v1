'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Order } from '@/lib/types';
import type { BarcodeState } from '@/store/orderStore';

const SCAN_FILL_MOTION_MS = 520;
const ACTIVE_ROW_SCROLL_RECHECK_MS = 180;
interface BarcodePopupProps {
  order: Order;
  barcode: BarcodeState;
  onClose: () => void;
  onCancel: () => void;
}

export default function BarcodePopup({ order, barcode, onClose, onCancel }: BarcodePopupProps) {
  const { total, done, currentScanIdx } = barcode;
  const listRef = useRef<HTMLDivElement>(null);
  const activeScanIdxRef = useRef<number | null>(null);
  const scanLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeScanIdx, setActiveScanIdx] = useState<number | null>(null);
  const [leavingScanIdx, setLeavingScanIdx] = useState<number | null>(null);
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = done >= total && total > 0;
  const scanningIdx = currentScanIdx;

  useEffect(() => {
    const previousIdx = activeScanIdxRef.current;

    if (scanLeaveTimerRef.current) {
      clearTimeout(scanLeaveTimerRef.current);
      scanLeaveTimerRef.current = null;
    }
    if (previousIdx !== null && previousIdx !== scanningIdx) {
      setLeavingScanIdx(previousIdx);
      setActiveScanIdx(scanningIdx);
      activeScanIdxRef.current = scanningIdx;
      scanLeaveTimerRef.current = setTimeout(() => {
        setLeavingScanIdx(null);
        scanLeaveTimerRef.current = null;
      }, SCAN_FILL_MOTION_MS);
      return () => {
        if (scanLeaveTimerRef.current) {
          clearTimeout(scanLeaveTimerRef.current);
          scanLeaveTimerRef.current = null;
        }
      };
    }

    setLeavingScanIdx(null);
    setActiveScanIdx(scanningIdx);
    activeScanIdxRef.current = scanningIdx;

    return () => {
      if (scanLeaveTimerRef.current) {
        clearTimeout(scanLeaveTimerRef.current);
        scanLeaveTimerRef.current = null;
      }
    };
  }, [scanningIdx]);

  useLayoutEffect(() => {
    if (activeScanIdx === null) return;
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-scan-index="${activeScanIdx}"]`);
    if (!list || !row) return;

    const keepActiveRowInView = () => {
      const listRect = list.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const rowTopInList = rowRect.top - listRect.top + list.scrollTop;
      const rowBottomInList = rowTopInList + rowRect.height;
      const bottomThreshold = rowRect.height * 2;
      const topThreshold = rowRect.height;
      const targetTopPadding = rowRect.height * 2;
      const visibleTop = list.scrollTop;
      const visibleBottom = visibleTop + list.clientHeight;
      const maxTop = Math.max(0, list.scrollHeight - list.clientHeight);
      let targetTop: number | null = null;

      if (rowBottomInList + bottomThreshold > visibleBottom) {
        targetTop = rowTopInList - targetTopPadding;
      } else if (rowTopInList - topThreshold < visibleTop) {
        targetTop = rowTopInList - targetTopPadding;
      }

      if (targetTop === null) return;
      const nextTop = Math.min(maxTop, Math.max(0, targetTop));
      if (Math.abs(nextTop - visibleTop) < 1) return;

      list.scrollTo({
        top: nextTop,
        behavior: 'smooth',
      });
    };

    keepActiveRowInView();
    const frame = requestAnimationFrame(keepActiveRowInView);
    const secondPassId = setTimeout(keepActiveRowInView, ACTIVE_ROW_SCROLL_RECHECK_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(secondPassId);
    };
  }, [activeScanIdx]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => list.classList.toggle('has-scrollbar', list.scrollHeight > list.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="barcode-popup">
      <div className={`barcode-popup-card ${isComplete ? 'is-complete' : 'is-scanning'}`} onClick={e => e.stopPropagation()}>
        <div className="barcode-popup-header">
          <div className="barcode-popup-title">Barcode Packing</div>
          <div className="barcode-popup-header-actions">
            <div className="barcode-progress-meta" aria-live="polite">
              <span>{done} / {total}</span>
            </div>
          </div>
        </div>
        <div className="barcode-popup-sub">Scan each item barcode to confirm the correct medicine before packing.</div>

        <div className="barcode-progress-track">
          <div
            className="barcode-progress-fill"
            style={{ ['--barcode-progress-pct' as string]: `${progressPct}%` }}
          />
        </div>

        <div className="barcode-scan-list" ref={listRef}>
          {order.items.map((item, idx) => {
            const isPacked = item.packed;
            const isScanning = activeScanIdx === idx && !isComplete;
            const isLeavingScan = leavingScanIdx === idx;
            const stateClass = isScanning && !isPacked ? 'scanning' : isPacked ? 'scanned' : 'waiting';
            return (
              <div
                key={idx}
                data-scan-index={idx}
                className={`barcode-scan-row ${stateClass}${isLeavingScan ? ' is-scan-leaving' : ''}`}
              >
                <div className="barcode-item-main">
                  <div className="barcode-item-copy">
                    <div className="barcode-item-name-row">
                      <span className="item-qty barcode-item-qty">×<span className="item-qty-number">{item.qty}</span></span>
                      <div className="barcode-item-name">{item.name}</div>
                      {item.expiry && (
                        <span className={`barcode-item-exp${isPacked ? ' is-visible' : ''}`}>exp {item.expiry}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`barcode-status-badge ${stateClass}`}>
                  {isPacked ? 'ADDED' : isScanning ? 'SCANNING...' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="barcode-popup-actions barcode-popup-actions-bottom">
          <button
            className={`barcode-cancel-btn barcode-cancel-btn-bottom barcode-action-btn ${isComplete ? 'is-hidden' : 'is-visible'}`}
            type="button"
            onClick={onCancel}
            aria-label="Cancel barcode packing"
            tabIndex={isComplete ? -1 : 0}
          >
            Cancel
          </button>
          <button
            className={`incoming-btn barcode-close-btn is-ready primary barcode-action-btn ${isComplete ? 'is-visible' : 'is-hidden'}`}
            type="button"
            onClick={onClose}
            tabIndex={isComplete ? 0 : -1}
          >
            Ready for Pickup
          </button>
        </div>

      </div>
    </div>
  );
}
