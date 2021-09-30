import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
class Products {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ unique: true })
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public quantity: number;

  @Column()
  public price: number;
}

export default Products;
