package de.bschandera;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Path {
    private final List<Field> path;

    private Path() {
        path = new ArrayList<>();
    }

    public static Path start(Field start) {
        Path result = new Path();
        result.path.add(start);
        return result;
    }

    public Path to(Field newHead) {
        Path result = new Path();
        result.path.addAll(path);
        result.path.add(newHead);
        return result;
    }

    public Field head() {
        return path.get(0);
    }

    public Field tail() {
        return path.get(path.size() - 1);
    }

    public int length() {
        return path.size();
    }

    public Optional<Path> walkToIfUnknown(Field newHead) {
        if (path.contains(newHead)) {
            return Optional.empty();
        } else {
            return Optional.of(to(newHead));
        }
    }

    @Override
    public boolean equals(Object another) {
        if (this == another) return true;
        if (another == null || getClass() != another.getClass()) return false;

        Path other = (Path) another;

        return path.equals(other.path);
    }

    @Override
    public int hashCode() {
        return path.hashCode();
    }

    @Override
    public String toString() {
        return path.stream()
                .map(Field::getValue)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append).toString();
    }
}
