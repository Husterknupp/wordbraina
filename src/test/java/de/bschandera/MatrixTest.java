package de.bschandera;

import org.junit.Test;

import java.util.List;
import java.util.NoSuchElementException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class MatrixTest {

    @Test
    public void testCstrAllowsDifferentRowLength() {
        String[][] strings = {{"a"}, {"f", "e"}};
        assertNotNull(new Matrix(strings));
    }

    @Test
    public void testInitNeighbours() {
        String[][] strings = {{"a", "f", "z"}, {"f", "e", "u"}, {"f", "e", "u"}};
        Matrix matrix = new Matrix(strings);

        List<Field> fields = matrix.initNeighbours();

        assertThat(fields.size(), is(9));
        assertThat(fields.get(0).getNeighbours().size(), is(3));
        assertThat(fields.get(2).getNeighbours().size(), is(3));
        assertThat(fields.get(6).getNeighbours().size(), is(3));
        assertThat(fields.get(8).getNeighbours().size(), is(3));
        assertThat(fields.get(4).getNeighbours().size(), is(8));
    }

    @Test
    public void testInitNeighboursDifferentRowCount() {
        String[][] strings = {{"a"}, {"f", "e"}, {"f", "e", "u"}};
        Matrix matrix = new Matrix(strings);

        List<Field> fields = matrix.initNeighbours();

        assertThat(fields.size(), is(6));
        assertThat(fields.get(0).getNeighbours().size(), is(2));
        assertThat(fields.get(1).getNeighbours().size(), is(4));
        assertThat(fields.get(2).getNeighbours().size(), is(5));
        assertThat(fields.get(3).getNeighbours().size(), is(3));
        assertThat(fields.get(4).getNeighbours().size(), is(4));
        assertThat(fields.get(5).getNeighbours().size(), is(2));
    }

    @Test
    public void testGetField() {
        String[][] strings = {{"a", "f", "z"}, {"f", "e", "u"}, {"f", "e", "u"}};
        Matrix matrix = new Matrix(strings);
        assertThat(matrix.getField(0, 0).getValue(), is("a"));
        assertThat(matrix.getField(1, 1).getValue(), is("e"));
        assertThat(matrix.getField(2, 2).getValue(), is("u"));

        matrix = new Matrix(3);
        matrix.addField(0, 0, "charlie");
        matrix.addField(0, 2, "chaplin");
        assertThat(matrix.getField(0, 0).getValue(), is("charlie"));
        assertThat(matrix.getField(0, 2).getValue(), is("chaplin"));
    }

    @Test(expected = NoSuchElementException.class)
    public void testGetFieldMissing() {
        String[][] strings = {{"a", "f", "z"}, {"f", "e", "u"}, {"f", "e", "u"}};
        Matrix matrix = new Matrix(strings);
        matrix.getField(0, 3);
    }

    @Test
    public void testHasField() {
        String[][] strings = {{"a", "f", "z"}, {"f", "e", "u"}, {"f", "e", "u"}};
        Matrix matrix = new Matrix(strings);
        assertThat(matrix.hasField(0, 0), is(true));
        assertThat(matrix.hasField(0, 3), is(false));
        assertThat(matrix.hasField(4, 0), is(false));
        assertThat(matrix.hasField(3, 3), is(false));
    }

}
