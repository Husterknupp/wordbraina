package de.bschandera;

import org.junit.Ignore;
import org.junit.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class AppTest {

    @Test
    public void testFindRealWords() {
        String[][] charMatrix = {{"s", "p"}, {"a", "ß"}};
        Matrix matrix = new Matrix(charMatrix);

        List<String> dictionaryWords = App.findDictionaryWords(4, matrix);

        assertThat(dictionaryWords, hasItem("spaß"));
        assertThat(dictionaryWords.size(), is(1));
    }

    @Ignore
    @Test // 29 seconds -> 9 seconds w List.contains
    public void testFindRealWords7charWords() {
        String[][] charMatrix = {
                {"e", "d", "l", "j"},
                {"n", "n", "k", "a"},
                {"k", "a", "u", "r"},
                {"o", "h", "p", "u"}};
        Matrix matrix = new Matrix(charMatrix);

        List<String> dictionaryWords = App.findDictionaryWords(7, matrix);

        assertThat(dictionaryWords.size(), is(3));
        assertThat(dictionaryWords, hasItems("raunend", "urkunde", "alkanen"));
    }

    @Test
    public void testFindRealWordsStrangeMatrix() {
        String[][] charMatrix = {
                {"i", "", "a", " "},
                {"a", "e", "m", "r"},
                {"g", "k", "l", "e"}};
        Matrix matrix = new Matrix(charMatrix);
        assertThat(App.findDictionaryWords(6, matrix).size(), is(0));
    }

    @Test
    public void testFindPossibleTokens() {
        String[][] charMatrix = {{"a", "l"}, {"k", "o"}};
        Matrix matrix = new Matrix(charMatrix);

        Set<String> possibleTokens = App.findPossibleTokens(matrix, 4);

        assertThat(possibleTokens.size(), is(4 * 6));
        assertThat(possibleTokens, hasItems(
                "alok", "alko", "akol", "aklo", "aokl", "aolk",
                "lako", "laok", "loka", "loak", "lkoa", "lkao",
                "kola", "koal", "kalo", "kaol", "klao", "kloa",
                "okal", "okla", "olak", "olka", "oalk", "oakl"));
        assertThat(new HashSet<>(possibleTokens).size(), equalTo(possibleTokens.size()));
    }

    @Test
    public void testWalkToNeighbours() {
        String[][] charMatrix = {{"a", "b"}, {"c", "d"}};
        Matrix matrix = new Matrix(charMatrix);
        List<Path> paths = matrix.initNeighbours().stream()
                .map(Path::start).collect(Collectors.toList());

        List<Path> newPaths = App.walkToNeighbours(paths);

        assertThat(newPaths.size(), is(12));
        assertThat(newPaths.get(0).length(), is(2));
        List<Path> startingFromA = newPaths.stream()
                .filter(path -> path.head().getValue().equals("a"))
                .collect(Collectors.toList());
        assertThat(startingFromA.size(), is(3));
    }

}
