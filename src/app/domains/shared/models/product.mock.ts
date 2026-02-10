import { generateFakeCategory } from './category.mock';
import { Product } from './product.model';
import { faker } from '@faker-js/faker';

export const generateFakeProduct = (data: Partial<Product> = {}): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number.parseFloat(faker.commerce.price()),
  images: [faker.image.url(), faker.image.url()],
  creationAt: faker.date.past().toISOString(),
  category: generateFakeCategory(data?.category),
  slug: faker.lorem.slug(),
  ...data,
});
