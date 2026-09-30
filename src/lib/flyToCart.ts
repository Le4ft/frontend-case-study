export const CART_FLY_TARGET_ID = 'cart-fly-target';

/**
 * Animates a small dot flying from `originEl` to the cart total (or, when
 * `reverse` is true, from the cart total back to `originEl`) using fixed-
 * position elements animated with the Web Animations API. Purely cosmetic —
 * cart state itself is already updated synchronously by the caller.
 */
export function flyToCart(originEl: HTMLElement, colorClass: string, reverse = false): void {
	const target = document.getElementById(CART_FLY_TARGET_ID);
	if (!target) return;

	const originRect = originEl.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();

	const from = { x: originRect.left + originRect.width / 2, y: originRect.top + originRect.height / 2 };
	const to = { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 };

	const start = reverse ? to : from;
	const end = reverse ? from : to;

	const dot = document.createElement('div');
	dot.className = `fixed z-[90] size-3 rounded-full pointer-events-none ${colorClass}`;
	dot.style.left = `${start.x}px`;
	dot.style.top = `${start.y}px`;
	dot.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(dot);

	const dx = end.x - start.x;
	const dy = end.y - start.y;

	const animation = dot.animate(
		[
			{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0 },
			{
				transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 40}px)) scale(1.1)`,
				opacity: 1,
				offset: 0.5
			},
			{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0, offset: 1 }
		],
		{ duration: 550, easing: 'cubic-bezier(0.3, 0, 0.6, 1)' }
	);

	animation.onfinish = () => dot.remove();
}
