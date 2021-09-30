import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Index({ unique: true })
  @Column()
  public email: string;

  @Column()
  public password: string;
}

export default User;
