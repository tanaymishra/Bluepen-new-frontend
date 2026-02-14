import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckCircle2, X } from 'lucide-react';
import styles from './promoCode.module.scss';
import { useAuth } from '@/authentication/authentication';

interface PromoCode {
  id: string;
  coupon_code: string;
  description: string;
  discount_type: string;
  discount_value: string;
  expiry: string;
  is_active: number;
}

interface PromoCodeProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
}

const PromoCode: React.FC<PromoCodeProps> = ({ onApply, onRemove, appliedCode }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPromocodes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/getCoupons`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Failed to fetch promocodes');
        const data = await response.json();
        setPromocodes(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching promocodes');
        console.error('Error fetching promocodes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchPromocodes();
    }
  }, [user?.token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (promoRef.current && !promoRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.promoContainer} ref={promoRef}>
      {appliedCode ? (
        <div className={styles.appliedPromo}>
          <div className={styles.appliedContent}>
            <CheckCircle2 size={20} className={styles.checkIcon} />
            <span>Promo code <strong>{appliedCode}</strong> applied</span>
          </div>
          <button 
            type="button"
            className={styles.removeButton} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <button 
            type="button"
            className={styles.promoToggle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <Tag size={20} />
            <span>Apply Promo Code</span>
          </button>

          {isExpanded && (
            <div className={styles.promoList}>
              {isLoading ? (
                <div className={styles.loadingState}>Loading promocodes...</div>
              ) : error ? (
                <div className={styles.errorState}>{error}</div>
              ) : (
                promocodes.map((promo) => (
                  <button
                    type="button"
                    key={promo.id}
                    className={styles.promoItem}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onApply(promo.coupon_code);
                      setIsExpanded(false);
                    }}
                  >
                    <div className={styles.promoDetails}>
                      <span className={styles.promoCode}>{promo.coupon_code}</span>
                      <span className={styles.promoDiscount}>{(promo.discount_type === "Absolute" && "₹") + promo.discount_value + (promo.discount_type==="Percentage" ? "%" :"")} off</span>
                      <span className={styles.promoDescription}>{promo.description}</span>
                    </div>
                    <span className={styles.applyText}>Apply</span>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PromoCode;