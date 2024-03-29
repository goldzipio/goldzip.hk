<?php
/**
 * MslsOutput
 * @author Dennis Ploetner <re@lloc.de>
 * @since 0.9.8
 */

namespace lloc\Msls;

/**
 * Output in the frontend
 * @package Msls
 */
class MslsOutput extends MslsMain {

	/**
	 * Holds the format for the output
	 * @var array $tags
	 */
	protected $tags;

	/**
	 * Creates and gets the output as an array
	 *
	 * @param int $display
	 * @param bool $filter
	 * @param bool $exists
	 *
	 * @uses MslsOptions
	 * @uses MslsLink
	 * @return array
	 */
	public function get( $display, $filter = false, $exists = false ) {
		$arr = [];

		$blogs = $this->collection->get_filtered( $filter );
		if ( $blogs ) {
			$mydata = MslsOptions::create();
			$link   = MslsLink::create( $display );

			foreach ( $blogs as $blog ) {
				$language = $blog->get_language();

				$link->src = $this->options->get_flag_url( $language );
				$link->alt = $language;

				$is_current_blog = $this->collection->is_current_blog( $blog );
				if ( $is_current_blog ) {
					$url       = $mydata->get_current_link();
					$link->txt = $blog->get_description();
				} else {
					switch_to_blog( $blog->userblog_id );

					if ( $this->is_requirements_not_fulfilled( $mydata, $exists, $language ) ) {
						restore_current_blog();
						continue;
					} else {
						$url       = $mydata->get_permalink( $language );
						$link->txt = $blog->get_description();
					}

					restore_current_blog();
				}

				if ( has_filter( 'msls_output_get' ) ) {
					/**
					 * Returns HTML-link for an item of the output-arr
					 * @since 0.9.8
					 *
					 * @param string $url
					 * @param MslsLink $link
					 * @param bool $is_current_blog
					 */
					$arr[] = ( string ) apply_filters( 'msls_output_get', $url, $link, $is_current_blog );
				} else {
					$arr[] = sprintf(
						'<a href="%s" title="%s"%s>%s</a>',
						$url,
						$link->txt,
						$is_current_blog ? ' class="current_language"' : '',
						$link
					);
				}
			}
		}

		return $arr;
	}

	/**
	 * @return string
	 */
    public function get_alternate_links() {
		$blogs  = MslsBlogCollection::instance();
		$mydata = MslsOptions::create();

		$arr     = [];
		$default = '';
		foreach ( $blogs->get_objects() as $blog ) {
			$language = $blog->get_language();
			$url      = $mydata->get_current_link();
			$current  = ( $blog->userblog_id == MslsBlogCollection::instance()->get_current_blog_id() );
			$title    = $blog->get_description();

			if ( ! $current ) {
				switch_to_blog( $blog->userblog_id );

				if ( MslsOptions::class != get_class( $mydata ) && ( is_null( $mydata ) || ! $mydata->has_value( $language ) ) ) {
					restore_current_blog();
					continue;
				}

				$url   = $mydata->get_permalink( $language );
				$title = $blog->get_description();

				restore_current_blog();
			}

			if ( has_filter( 'msls_head_hreflang' ) ) {
				/**
				 * Overrides the hreflang value
				 * @since 0.9.9
				 * @param string $language
				 */
				$hreflang = (string) apply_filters( 'msls_head_hreflang', $language );
			}
			else {
				$hreflang = $blog->get_alpha2();
			}

			if ( '' === $default ) {
				$default = sprintf(
					'<link rel="alternate" hreflang="x-default" href="%s" title="%s" />',
					$url,
					esc_attr( $title )
				);
			}

			$arr[] = sprintf(
				'<link rel="alternate" hreflang="%s" href="%s" title="%s" />',
				$hreflang,
				$url,
				esc_attr( $title )
			);
		}

		if ( 1 === count( $arr ) ) {
			return $default;
		}
		else {
			return implode( PHP_EOL, $arr );
		}
	}

	/**
	 * Returns a string when the object will be treated like a string
	 * @return string
	 */
	public function __toString() {
		$display = (int) $this->options->display;
		$filter  = false;
		$exists  = isset( $this->options->only_with_translation );

		$arr = $this->get( $display, $filter, $exists );
		if ( empty( $arr ) ) {
			return '';
		}

		$tags = $this->get_tags();

		return $tags['before_output'] . $tags['before_item'] .
		       implode( $tags['after_item'] . $tags['before_item'], $arr ) .
		       $tags['after_item'] . $tags['after_output'];
	}

	/**
	 * Gets tags for the output
	 * @return array
	 */
	public function get_tags() {
		if ( empty( $this->tags ) ) {
			$this->tags = array(
				'before_item'   => $this->options->before_item,
				'after_item'    => $this->options->after_item,
				'before_output' => $this->options->before_output,
				'after_output'  => $this->options->after_output,
			);

			/**
			 * Returns tags array for the output
			 * @since 1.0
			 *
			 * @param array $tags
			 */
			$this->tags = ( array ) apply_filters( 'msls_output_get_tags', $this->tags );
		}

		return $this->tags;
	}

	/**
	 * Sets tags for the output
	 *
	 * @param array $arr
	 *
	 * @return MslsOutput
	 */
	public function set_tags( array $arr = [] ) {
		$this->tags = wp_parse_args( $this->get_tags(), $arr );

		return $this;
	}

	/**
	 * Returns true if the requirements not fulfilled
	 *
	 * @param MslsOptions|null $thing
	 * @param boolean $exists
	 * @param string $language
	 *
	 * @return boolean
	 */
	public function is_requirements_not_fulfilled( $thing, $exists, $language ) {
		if ( is_null( $thing ) ) {
			return $exists;
		}

		return MslsOptions::class != get_class( $thing ) && ! $thing->has_value( $language ) && $exists;
	}

}
