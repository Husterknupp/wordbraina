package de.bschandera;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PathTest {

    @Test
    public void testWalkToIfUnknown() throws Exception {
        Field same = new Field(0, 0, "a");
        assertThat(Path.start(same).walkToIfUnknown(same).isPresent(), is(false));
    }

    @Test
    public void testWalkToIfUnknownTransitive() throws Exception {
        Field a = new Field(0, 0, "a");
        Field b = new Field(0, 1, "b");
        Path aToB = Path.start(a).to(b);
        assertThat(aToB.tail(), is(b));
        assertThat(aToB.walkToIfUnknown(a).isPresent(), is(false));
    }

    @Test
    public void testTo() {
        Field a = new Field(0, 0, "a");
        Field b = new Field(0, 1, "b");
        Path aToB = Path.start(a).to(b);
        assertThat(aToB.tail(), is(b));
    }

    @Test
    public void testToString() {
        Path path = Path.start(new Field(0, 0, "a")).to(new Field(0, 1, "b")).to(new Field(0, 2, "c"));
        assertThat(path.toString(), equalTo("abc"));
    }
}
