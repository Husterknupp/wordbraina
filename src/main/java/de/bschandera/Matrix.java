package de.bschandera;

import com.google.common.base.Strings;
import com.google.common.collect.Iterables;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

public class Matrix {
    private final int rowCount;
    private final List<Field>[] rows;

    public Matrix(int rowCount) {
        this.rowCount = rowCount;
        rows = new ArrayList[rowCount];
        for (int i = 0; i < rowCount; i++) {
            rows[i] = new ArrayList<>();
        }
    }

    public Matrix(String[][] values) {
        this(values.length);
        for (int i = 0; i < rowCount; i++) {
            for (int j = 0; j < values[i].length; j++) {
                String value = values[i][j];
                if (Strings.isNullOrEmpty(value.trim())) {
                    continue;
                }
                addField(j, i, value);
            }
        }
    }

    public void addField(int x, int y, String value) {
        rows[y].add(new Field(x, y, value));
    }

    public Field getField(int x, int y) {
        if (!hasField(x, y)) {
            throw new NoSuchElementException("no field for x=" + x + ", y=" + y);
        }
        return Iterables.find(rows[y], input -> input.getX() == x);
    }

    public List<Field> getFields() {
        List<Field> result = new ArrayList<>();
        for (List<Field> row : rows) {
            result.addAll(row);
        }
        return result;
    }

    public boolean hasField(int x, int y) {
        boolean result = false;
        for (List<Field> row : rows) {
            result |= row.stream()
                    .map(Field::getPosition)
                    .filter(position -> position.equals(x, y))
                    .findFirst().isPresent();
        }
        return result;
    }

    // todo use builder
    public List<Field> initNeighbours() {
        for (int i = 0; i < rowCount; i++) {
            for (Field field : rows[i]) {
                // only right and below
                addNeighbourIfPresent(field, field.getX() + 1, field.getY());
                addNeighbourIfPresent(field, field.getX(), field.getY() + 1);
                addNeighbourIfPresent(field, field.getX() + 1, field.getY() + 1);
                if (field.getX() != 0) {
                    // also fields to the left
                    addNeighbourIfPresent(field, field.getX() - 1, field.getY());
                    addNeighbourIfPresent(field, field.getX() - 1, field.getY() + 1);
                }
                if (field.getY() != 0) {
                    // also fields above
                    addNeighbourIfPresent(field, field.getX() + 1, field.getY() - 1);
                    addNeighbourIfPresent(field, field.getX(), field.getY() - 1);
                }
                if (field.getX() != 0 && field.getY() != 0) {
                    // also upper left corner
                    addNeighbourIfPresent(field, field.getX() - 1, field.getY() - 1);
                }
            }
        }
        return getFields();
    }

    public void addNeighbourIfPresent(Field field, int newX, int newY) {
        if (hasField(newX, newY)) {
            field.addNeighbour(getField(newX, newY));
        }
    }

    public static Optional<Matrix> fromConsole() {
        System.out.println("Wieviel Zeilen?");
        int rowCount;
        try {
            rowCount = Integer.valueOf(System.console().readLine());
        } catch (NumberFormatException e) {
            System.out.println("[FEHLER] Das ist keine Zahl");
            return Optional.empty();
        }
        String[][] rows = new String[rowCount][];
        for (int i = 0; i < rowCount; i++) {
            char[] row = System.console().readLine().toCharArray();
            rows[i] = toStringArray(row);
        }
        return Optional.of(new Matrix(rows));
    }

    private static String[] toStringArray(char[] chars) {
        List<String> rowAsStrings = new ArrayList<>();
        for (char c : chars) {
            rowAsStrings.add(String.valueOf(c));
        }
        return rowAsStrings.toArray(new String[rowAsStrings.size()]);
    }

}
