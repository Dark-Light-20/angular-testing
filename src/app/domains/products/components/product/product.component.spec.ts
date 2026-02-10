import {
  byTestId,
  createRoutingFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';

const mockProduct = generateFakeProduct();

describe('ProductComponent', () => {
  let spectator: Spectator<ProductComponent>;

  const createComponent = createRoutingFactory(ProductComponent);

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('product', mockProduct);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should emit addToCart event when addToCartHandler is called', () => {
    jest.spyOn(spectator.component.addToCart, 'emit');

    spectator.component.addToCartHandler();
    spectator.detectChanges();

    expect(spectator.component.addToCart.emit).toHaveBeenCalledWith(
      spectator.component.product()
    );
  });

  it('should render product name and price', () => {
    spectator.detectChanges();

    expect(spectator.query(byTestId('product-title'))).toHaveText(
      mockProduct.title
    );
  });

  it('should have emit a product when button is clicked', () => {
    const emitSpy = jest.spyOn(spectator.component.addToCart, 'emit');

    spectator.detectChanges();
    spectator.click(byTestId('add-to-cart-button'));

    spectator.component.addToCartHandler();
    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });
});
