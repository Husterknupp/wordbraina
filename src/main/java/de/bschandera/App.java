package de.bschandera;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * INPUT:
 * expected matrix size
 * word length L of dictionary words
 * character matrix (rows can be of different length
 * <p>
 * OUTPUT:
 * all words
 * - found in a given dictionary
 * - with the exact length L
 * - that are applicable as a graph in the given matrix
 * <p>
 * <p>
 * A   |    B
 * ____|_____
 *     |
 * C   |    D
 */
public class App {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("[FEHLER] Du musst die gesuchte Wort-Länge angeben");
            System.out.println("Zum Beispiel wenn du ein 3-Buchstaben langes Wort suchst:");
            System.out.println("java -jar target/wordbraina-1.0-SNAPSHOT.jar 3");
            return;
        }
        Integer wordLength;
        try {
            wordLength = Integer.valueOf(args[0]);
        } catch (java.lang.NumberFormatException e) {
            System.out.println("[FEHLER] Du musst die gesuchte Wort-Länge angeben");
            System.out.println("Zum Beispiel wenn du ein 3-Buchstaben langes Wort suchst:");
            System.out.println("java -jar target/wordbraina-1.0-SNAPSHOT.jar 3");
            return;
        }

        Optional<Matrix> matrix = Matrix.fromConsole();
        if (!matrix.isPresent()) {
            return;
        }
        System.out.println("[INFO] " + matrix.get().getFields().size() + "-Felder Matrix " +
                "und " + wordLength + "-Buchstaben Wörter gesucht.. alles klar.");
        List<String> result = findDictionaryWords(wordLength, matrix.get());
        if (!(result.size() > 0)) {
            System.out.println("Keine Wörter gefunden :-/");
        } else {
            System.out.println(result);
        }
    }

    public static List<String> findDictionaryWords(Integer wordLength, Matrix matrix) {
        Set<String> token = findPossibleTokens(matrix, wordLength);
        Dictionary dictionary = new Dictionary(wordLength);
        return token.parallelStream()
                .filter(dictionary::containsExactly)
                .collect(Collectors.toList());
    }

    public static Set<String> findPossibleTokens(Matrix matrix, int wordLength) {
        List<Path> paths = new ArrayList<>();
        for (Field field : matrix.initNeighbours()) {
            paths.add(Path.start(field));
        }
        while (paths.get(0).length() < wordLength) {
            paths = walkToNeighbours(paths);
        }
        return paths.stream().map(Path::toString).collect(Collectors.toSet());
    }

    public static List<Path> walkToNeighbours(List<Path> paths) {
        Set<Path> result = new HashSet<>();
        for (Path path : paths) {
            for (Field neighbour : path.tail().getNeighbours()) {
                path.walkToIfUnknown(neighbour).ifPresent(result::add);
            }
        }
        return new ArrayList<>(result);
    }
}
