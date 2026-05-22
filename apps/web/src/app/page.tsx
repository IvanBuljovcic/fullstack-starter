import { Checkbox, Loader } from '@/components/shared';
import { Radio } from '@/components/shared/Radio';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Loader size="medium" />

      {/* <Checkbox label="Clickme" /> */}

      <Checkbox label="Small" size="sm" />
      <Checkbox label="Medium" size="md" />
      <Checkbox
        error="dasda"
        helperText="Click to check"
        label="Large"
        size="lg"
      />
      <Checkbox label="Default" />

      <fieldset
        style={{
          padding: '0.5em 1em',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
        }}
      >
        <Radio label="Foo" name="foo" size="sm" value="Foo" />
        <Radio label="Bar" name="foo" size="lg" value="Bar" />
        <Radio label="Baz" name="foo" size="md" value="Baz" />
      </fieldset>

      <fieldset
        style={{
          padding: '0.5em 1em',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
        }}
      >
        <Radio label="Foo" name="bar" value="Foo" />
        <Radio label="Bar" name="bar" value="Bar" />
        <Radio label="Baz" name="bar" value="Baz" />
      </fieldset>
    </div>
  );
}
