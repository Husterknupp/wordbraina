package de.bschandera;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class Field {
    private final String value;
    private final Position position;
    private List<Field> neighbours;

    public Field(int posX, int posY, String value) {
        this.position = new Position(posX, posY);
        this.value = value;
        neighbours = new ArrayList<>();
    }

    public int getX() {
        return position.x();
    }

    public int getY() {
        return position.y();
    }

    public Position getPosition() {
        return position;
    }

    public String getValue() {
        return value;
    }

    public void addNeighbour(Field neighbour) {
        neighbours.add(neighbour);
    }

    public void addNeighbours(final Field oneNeighbour, Field... moreNeighbours) {
        neighbours.add(oneNeighbour);
        Optional.ofNullable(moreNeighbours).ifPresent(n -> Collections.addAll(neighbours, n));
    }

    public List<Field> getNeighbours() {
        return neighbours;
    }

    @Override
    public String toString() {
        return "Field{" +
                "posX=" + position.x() +
                ", posY=" + position.y() +
                ", value='" + value + '\'' +
                '}';
    }
}
